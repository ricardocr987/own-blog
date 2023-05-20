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
            types: 'PostStoredAleph',
            pagination: 1,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: param ? Array.isArray(param) ? [...param] : [`user:${param}`] : [],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        switch(userResponse.posts.length) {
            case 0:
                return res.status(404).send('User not found');
            case 1:
                return res.status(201).json(decryptData(userResponse.posts[0].content.data));
            default: 
                const users = []
                for (const post of userResponse.posts) {
                    users.push(decryptData(post.content.data))
                }
                return res.status(201).json(JSON.stringify(users));
        }
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}