import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { Author, PostStoredAleph, Subscription, UpdateSubscriptionPayload } from "@/types";
import { CreateAppInstructionAccounts, CreateTokenInstructionAccounts, EditTokenPriceInstructionAccounts, InstructionType, getInstructionType } from "@/utils/solita";
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import { PartiallyDecodedInstruction } from "@solana/web3.js";
import { decryptData, encryptData } from "@/utils/encrypt";
import { connection, messagesAddress } from "@/constants";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import bs58 from "bs58";
import { parseInstructionAccounts } from "@/utils/transactionParser";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');
    const session = await getServerSession(req, res, authOptions(req))
    if (!session) return res.status(401).send({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)))
        const subInfo = JSON.parse(req.body) as UpdateSubscriptionPayload

        // validate transaction
        const transaction = await connection.getParsedTransaction(subInfo.brickSignature, { commitment: 'confirmed' })

        let author: string = ''
        let allowed = false
        if (transaction && transaction.meta?.innerInstructions) {
            if (transaction)
            for (const ix of transaction.transaction.message.instructions) {
                const rawIx = ix as PartiallyDecodedInstruction
                // when we get the type is because anchor discriminators are found in the ix, so its from the brick program
                const type = getInstructionType(Buffer.from(bs58.decode(rawIx.data)))
                if (type) {
                    const accounts = parseInstructionAccounts(type, rawIx)
                    if (type == InstructionType.EditTokenPrice) {
                        const { authority } = accounts as EditTokenPriceInstructionAccounts
                        if (authority.toString() !== session.user.id)
                            return res.status(401).send('Wrong transaction sir')
                        
                        author = authority.toString()
                        allowed = true
                    }
                    if (type == InstructionType.CreateToken) {
                        const { authority } = accounts as CreateTokenInstructionAccounts
                        if (authority.toString() !== session.user.id)
                            return res.status(401).send('Wrong transaction sir')
                        
                        author = authority.toString()
                        allowed = true
                    }
                }
            }
        }
        if (!allowed) return res.status(400).send('Any brick instructions')

        const userResponse = await getPost<PostStoredAleph>({
            types: 'PostStoredAleph',
            pagination: 1,
            page: 1,
            refs: [],
            addresses: [messagesAddress],
            tags: [`user:${author}`],
            hashes: [],
            APIServer: "https://api2.aleph.im"
        });

        let data = JSON.parse(decryptData(userResponse.posts[0].content.data)) as Author
        data.subscriptionBrickToken = subInfo.subscriptionBrickToken
        data.subscriptionPrice = subInfo.subscriptionPrice
        data.subscriptionToken = subInfo.subscriptionToken

        await publishPost({
            account: account,
            postType: 'amend',
            ref: userResponse.posts[0].hash,
            content: {
                data: encryptData(JSON.stringify(data)),
                tags: ['user', data.pubkey, data.username, `user:${data.pubkey}`]
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