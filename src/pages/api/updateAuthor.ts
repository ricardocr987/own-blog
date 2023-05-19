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
        const user = JSON.parse(req.body) as Author
        const usersResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: ['user'],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        for (const post of usersResponse.posts) {
            const profile = JSON.parse(decryptData(post.content.data)) as Author
            if (profile.username === user.username) {
                await publishPost({
                    account: account,
                    postType: 'PostStoredAleph',
                    content: {
                        data: encryptData(req.body),
                        tags: ['author', user.pubkey]
                    },
                    channel: 'own-blog',
                    APIServer: 'https://api2.aleph.im',
                    inlineRequested: true,
                    storageEngine: ItemType.inline
                })
            }
        }

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}