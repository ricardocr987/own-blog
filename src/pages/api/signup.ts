import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { NextApiRequest, NextApiResponse } from "next";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ReducedAuthor } from "@/types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!process.env.MESSAGES_KEY) return res.send({
        error: "env undefined",
    });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const post = await getPost<ReducedAuthor[]>({
            types: 'ReducedAuthor[]',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [],
            tags: [],
            hashes: ['8492047c3e749ad0b10f55510e0b62fbf35143c706fa5059c1d073f32c14f4f9'],
            APIServer: "https://api2.aleph.im"
        })
        const content = []
        const previousContent = post.posts[0].content
        const newUser = JSON.parse(req.body)

        const foundUser = previousContent.find(user => user.username === newUser.username);
        if (foundUser) return res.status(406).send('User already exists');

        /*const uniqueUsernames = new Set<string>();
        const uniqueContent = previousContent.filter(obj => {
          if (uniqueUsernames.has(obj.username)) {
            // object has a duplicate username, so exclude it from the result
            return false;
          } else {
            // object has a unique username, so include it in the result and update the set
            uniqueUsernames.add(obj.username);
            return true;
          }
        });
        const filteredContent = previousContent.filter(obj => obj.hasOwnProperty('pubkey'));*/

        content.push(...previousContent, newUser)
        await publishPost({
            account,
            postType: 'amend',
            ref: '8492047c3e749ad0b10f55510e0b62fbf35143c706fa5059c1d073f32c14f4f9',
            content, 
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}