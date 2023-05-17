import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { postArticle } from "@/utils/postArticle";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

import { Post } from "@/types";
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { updateAuthorArticles } from "@/utils/updateAuthorArticles";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newPost = JSON.parse(req.body) as Post

        if (newPost.author.id !== session.user.id) return res.status(400).send('You should not try to change other users data :/') 
        // creates an specific aggregate for the whole article
        await postArticle(account, newPost)
        // updates author aggregate including the post id
        await updateAuthorArticles(account, session.user.id, newPost.id)

        // creates a post with the post id + his tags
        await publishPost({
            account: account,
            postType: 'Post',
            content: {id: newPost.id, tags: newPost.tags},
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        console.log('Publish error:', error);
        return res.status(500).send('Internal Server Error.');
    }
}
