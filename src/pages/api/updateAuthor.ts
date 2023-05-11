import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ReducedAuthor, UsernameAndPubkey } from "@/types";
import { createUserAggregate } from "@/utils/createUserAggregate"; 
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const newUser = JSON.parse(req.body)

        const post = await getPost<UsernameAndPubkey[]>({
            types: 'UsernameAndPubkey[]',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [],
            tags: [],
            hashes: ['e20405765ee6eff946c34803e3be913124181f9a10ba3d736c93178f459e32a7'],
            APIServer: "https://api2.aleph.im"
        })
        const previousContent = post.posts[0].content
        // check if the new username exists
        const foundUser = previousContent.find(user => user.username === newUser.username);
        if (foundUser) return res.status(406).send('User already exists');

        // changes the username in the post with the user reduced info
        const foundUserIndex = previousContent.findIndex(user => user.id === newUser.pubkey);
        if (foundUserIndex !== -1) {
            previousContent[foundUserIndex].username = newUser.username;
        }

        // updates post with authors pubkeys
        await publishPost({
            account,
            postType: 'amend',
            ref: 'e20405765ee6eff946c34803e3be913124181f9a10ba3d736c93178f459e32a7',
            content: previousContent, 
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })


        // updates user aggregate message
        await createUserAggregate(account, newUser)

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}