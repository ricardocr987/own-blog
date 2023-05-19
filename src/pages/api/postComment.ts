import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { CommentInfo, Comments, PostStoredAleph } from "@/types";
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { decryptData, encryptData } from "@/utils/encrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { messagesAddress } from "@/constants";
import { getServerSession } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const newComment = JSON.parse(req.body) as CommentInfo

        const commentsResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [],
            hashes: [newComment.hashId],
            APIServer: "https://api2.aleph.im"
        });

        const data = JSON.parse(decryptData(commentsResponse.posts[0].content.data)) as Comments
        data.comments.push(newComment)

        await publishPost({
            account: account,
            postType: 'amend',
            content: { data: encryptData(JSON.stringify(data)) },
            ref: newComment.hashId,
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