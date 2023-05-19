import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { decryptData, encryptData } from "@/utils/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { Author, PostStoredAleph } from "@/types";
import { messagesAddress } from "@/constants";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const newUser = JSON.parse(req.body) as Author
        const usersResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [newUser.username],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });
        if (usersResponse.posts.length > 0)  return res.status(406).send('User already exists');

        //post with the profile
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(req.body),
                tags: ['user', newUser.pubkey, newUser.username, `user:${newUser.pubkey}`]
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        // post with article subscription content
        await publishPost({
            account: account,
            postType: 'amend',
            content: {
                data: encryptData(JSON.stringify({ authorId: newUser.pubkey, subs: [] })),
                tags: ['subscription', newUser.pubkey, `subscription:${newUser.pubkey}`],
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