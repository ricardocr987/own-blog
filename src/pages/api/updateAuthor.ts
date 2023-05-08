import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ReducedAuthor } from "@/types";
import { createUserAggregate } from "@/utils/createUserAggregate";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!process.env.MESSAGES_KEY) return res.send({
        error: "env undefined",
    });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const newUser = JSON.parse(req.body)

        const post = await getPost<ReducedAuthor[]>({
            types: 'string[]',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [],
            tags: [],
            hashes: ['3bf745986fdeaab767f254a3c727e4a7a0f1eabcfb8a031eadfc81fbfde561d2'],
            APIServer: "https://api2.aleph.im"
        })
        const previousContent = post.posts[0].content
        previousContent.forEach(user => {
            if (user.id === newUser.pubkey) {
                user.username = newUser.username;
            }
        });
          
        // updates post with authors pubkeys
        await publishPost({
            account,
            postType: 'amend',
            ref: '3bf745986fdeaab767f254a3c727e4a7a0f1eabcfb8a031eadfc81fbfde561d2',
            content: previousContent, 
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })
        
        // update user aggregate message
        await createUserAggregate(account, newUser)

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}