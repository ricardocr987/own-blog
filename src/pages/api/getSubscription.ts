import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { decryptData, encryptData } from "@/utils/encrypt";
import { PostStoredAleph, Subscription } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { messagesAddress } from "@/constants";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const param = req.query.param

        const subsResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 1,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: param ?  Array.isArray(param) ? ['subscription', ...param] : ['subscription', param] : [],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        const data = JSON.parse(decryptData(subsResponse.posts[0].content.data)) as Subscription

        const monthTimestamp = 30 * 24 * 60 * 60 * 1000
        const oneMonthAgo = Date.now() - monthTimestamp;
        const updatedSubs = data.subs.filter((sub) => sub.timestamp >= oneMonthAgo);

        await publishPost({
            account: account,
            postType: 'amend',
            content: {
                data: encryptData(JSON.stringify(updatedSubs)),
                tags: param ?  Array.isArray(param) ? ['subscription', ...param] : ['subscription', param] : [],
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        if (subsResponse.posts.length === 1) {
            return res.status(201).json(decryptData(subsResponse.posts[0].content.data));
        } else {
            if(subsResponse.posts.length > 1) {
                const articles = []
                for (const post of subsResponse.posts) {
                    articles.push(decryptData(post.content.data))
                }
                return res.status(201).json(JSON.stringify(articles));
            }
        } 
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}