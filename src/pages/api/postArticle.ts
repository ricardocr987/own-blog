import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { encryptData } from "@/utils/encrypt";
import { getServerSession } from "next-auth";
import { Post } from "@/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newPost = JSON.parse(req.body) as Post
        if (newPost.author.id !== session.user.id) return res.status(400).send('You should not try to change other users data :/')
        
        // post with article comments content, the hash is included in the article object to fetch it in the post page
        const responseComments = await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: { data: encryptData(JSON.stringify({ articleId: newPost.id, comments: [] })) },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })
        newPost.commentsPostHash = responseComments.item_hash
        newPost.tags.push('article', newPost.id, `article:${newPost.author.id}`, `article:${newPost.id}`);
        const tags = newPost.tags;
        // post with article content
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: { 
                data: encryptData(JSON.stringify(newPost)), 
                tags: tags 
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        return res.status(500).send('Internal Server Error.');
    }
}