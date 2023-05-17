import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { postArticle } from "@/utils/postArticle";
import { GetArticleResponse, Comment } from "@/types";
import { messagesAddress } from "@/constants";
import { post } from "aleph-sdk-ts/dist/messages";
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newComment = JSON.parse(req.body) as Comment
        if (newComment.username !== session.user.username) return res.status(400).send('You should not try to change other users data :/') 

        const response = await getAggregate<GetArticleResponse>({
            keys: [newComment.postId],
            address: messagesAddress,
            APIServer: 'https://api2.aleph.im',
        });
        
        response[newComment.postId].comments.push(newComment)
        // creates an specific aggregate for the whole article
        await postArticle(account, response[newComment.postId])

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        console.log('Publish error:', error);
        return res.status(500).send('Internal Server Error.');
    }
}
