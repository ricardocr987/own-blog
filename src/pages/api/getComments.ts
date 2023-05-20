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
        const commmentsResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 1,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: param ?  Array.isArray(param) ? ['comments', ...param] : ['comments', param] : [],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        return res.status(201).json(decryptData(commmentsResponse.posts[0].content.data));
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}