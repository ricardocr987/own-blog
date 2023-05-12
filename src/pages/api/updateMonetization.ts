import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { UsernameAndPubkey } from "@/types";
import { createUserAggregate } from "@/utils/createUserAggregate"; 
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const newUser = JSON.parse(req.body)
        // updates user aggregate message with subscriptionPrice, subscriptionToken & subscriptionBrickToken
        await createUserAggregate(account, newUser)

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}