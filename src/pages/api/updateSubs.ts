import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { Author } from "@/types";
import { createUserAggregate } from "@/utils/createUserAggregate"; 
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { connection } from "@/constants";

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
        const { profile, signature }: { profile: Author, signature: string } = JSON.parse(req.body)

        const transaction = await connection.getTransaction(signature)
        if (transaction) {
            for (const ix of transaction.transaction.message.instructions) {
                console.log(ix)
            }
        } else {
            res.status(500).send('Internal Server Error.');
        }
        // updates user aggregate message
        await createUserAggregate(account, profile)

        return res.status(201).send("User created correctly");
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}