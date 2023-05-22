import { BuyTokenInstructionAccounts, InstructionType, UseTokenInstructionAccounts, getInstructionType } from "@/utils/solita";
import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { PostStoredAleph, Subscription, SubscriptionInfo } from "@/types";
import { parseInstructionAccounts } from "@/utils/transactionParser";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { PartiallyDecodedInstruction } from "@solana/web3.js";
import { decryptData, encryptData } from "@/utils/encrypt";
import { connection, messagesAddress } from "@/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import bs58 from "bs58";

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
            pagination: 1,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [`subscription:${subInfo.authorId}`],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        const data = JSON.parse(decryptData(subsResponse.posts[0].content.data)) as Subscription

        // check historic transaction, to avoid replay attack
        const signatureHistory = data.subs.some((sub) => sub.subTransaction === subInfo.subTransaction)
        if (signatureHistory) return res.status(400).send('Are you trying to submit a already submitted transaction? gn') 

        // validate transaction
        const transaction = await connection.getParsedTransaction(subInfo.subTransaction, { commitment: 'confirmed' })

        let check = false
        if (transaction && transaction.meta?.innerInstructions) {
            if (transaction)
            for (const ix of transaction.transaction.message.instructions) {
                const rawIx = ix as PartiallyDecodedInstruction
                // when we get the type is because anchor discriminators are found in the ix, so its from the brick program
                const type = getInstructionType(Buffer.from(bs58.decode(rawIx.data)))
                if (type) {
                    const accounts = parseInstructionAccounts(type, rawIx)
                    if (type == InstructionType.BuyToken) {
                        const { authority, tokenMint } = accounts as BuyTokenInstructionAccounts
                        if (authority.toString() !== session.user.id || subInfo.brickToken.toString() !== tokenMint.toString())
                            return res.status(401).send('Wrong transaction sir')
                    }
                    if (type == InstructionType.UseToken) {
                        const { authority, tokenMint } = accounts as UseTokenInstructionAccounts
                        if (authority.toString() !== session.user.id || subInfo.brickToken !== tokenMint.toString())
                            return res.status(401).send('Wrong transaction sir')
                            
                        check = true
                    }
                }
            }
        }
        if(!check) return res.status(401).send('Wrong transaction sir')

        data.subs.push(subInfo)

        await publishPost({
            account: account,
            postType: 'amend',
            ref: subsResponse.posts[0].hash,
            content: {
                data: encryptData(JSON.stringify(data)),
                tags: ['subscription', subInfo.authorId, `subscription:${subInfo.authorId}`],
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