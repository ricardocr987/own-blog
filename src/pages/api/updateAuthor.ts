import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { decryptData, encryptData } from "@/utils/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { Author, PostStoredAleph } from "@/types";
import { messagesAddress } from "@/constants";
import { getServerSession } from "next-auth";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    
    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const updatedUser = JSON.parse(req.body) as Author
        const responseCheckUsername = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [updatedUser.username],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });
        if (responseCheckUsername.posts.length > 0)  return res.status(406).send('User already exists');

        const usersResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [`user:${updatedUser.pubkey}`],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });
        if (usersResponse.posts.length === 0)  return res.status(406).send('User does not exists');

        // delete previous post with the old user data
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(req.body),
                tags: ['user', updatedUser.pubkey, updatedUser.username, `user:${updatedUser.pubkey}`]
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}