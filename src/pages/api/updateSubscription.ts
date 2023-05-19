import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { PostStoredAleph, Subscription, SubscriptionInfo } from "@/types";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
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
        const subInfo = JSON.parse(req.body) as SubscriptionInfo
        if (subInfo.pubkey !== session.user.id) return res.status(400).send('Are you trying to impersonate someone? gm') 

        const subsResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 200,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: ['subscription', subInfo.authorId],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        // validate transaction subInfo.subTransaction

        const data = JSON.parse(decryptData(subsResponse.posts[0].content.data)) as Subscription
        data.subs.push(subInfo)

        await publishPost({
            account: account,
            postType: 'PostStoredAleph',
            content: {
                data: encryptData(JSON.stringify(data)),
                tags: ['subscription', data]
            },
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })

        return res.status(201).send('Monetization updated!');
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}