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
        const userResponse = await getPost<PostStoredAleph>({
            types: 'string',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: param ?  Array.isArray(param) ? ['user', ...param] : ['user', param] : [],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        if (userResponse.posts.length === 1) {
            return res.status(201).json(decryptData(userResponse.posts[0].content.data));
        } else {
            if(userResponse.posts.length > 1) {
                const articles = []
                for (const post of userResponse.posts) {
                    articles.push(decryptData(post.content.data))
                }
                return res.status(201).json(JSON.stringify(articles));
            }
        }    
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}