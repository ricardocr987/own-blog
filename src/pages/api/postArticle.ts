import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { encryptData } from "@/utils/encrypt";
import { getServerSession } from "next-auth";
import { Post } from "@/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).json({ message: "You must be logged in." });
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newPost = JSON.parse(req.body) as Post
        if (newPost.author.id !== session.user.id) return res.status(400).send('You should not try to change other users data :/')
        const tags = newPost.tags.push('article', newPost.author.id)

        // post with article content
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(req.body),
                tags: tags
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        // post with article subscription content
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(JSON.stringify({     
                    authorId: newPost.id,
                    subs: []
                })),
                tags: ['subscription', newPost.author.id],
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })
        
        // post with article comments content
        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(JSON.stringify({     
                    articleId: newPost.id,
                    comments: []
                })),
                tags: ['comments', newPost.id],
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