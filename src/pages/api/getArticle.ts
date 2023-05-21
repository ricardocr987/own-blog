import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { NextApiRequest, NextApiResponse } from "next";
import { messagesAddress } from "@/constants";
import { decryptData } from "@/utils/encrypt";
import { PostStoredAleph } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

    try {
        const param = req.query.param
        const articleResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: param ? Array.isArray(param) ? [...param] : [`article:${param}`] : ['article'],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        if (articleResponse.posts.length === 1) {
            return res.status(201).json(decryptData(articleResponse.posts[0].content.data));
        } else {
            if(articleResponse.posts.length > 1) {
                const articles = []
                for (const post of articleResponse.posts) {
                    articles.push(decryptData(post.content.data))
                }
                return res.status(201).json(JSON.stringify(articles));
            }
        }
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}