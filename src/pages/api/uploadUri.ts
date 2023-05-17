import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { Uri } from "@/types";

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
        const uri = JSON.parse(req.body) as Uri
        const response = await publishPost({
            account,
            postType: 'amend',
            content: uri, 
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })
        

        return res.status(201).send(response.item_hash);
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}