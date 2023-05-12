import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { postArticle } from "@/utils/postArticle";
import { Post } from "@/types";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newPost = JSON.parse(req.body) as Post

        // creates an specific aggregate for the whole article
        await postArticle(account, newPost)

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        console.log('Publish error:', error);
        return res.status(500).send('Internal Server Error.');
    }
}
