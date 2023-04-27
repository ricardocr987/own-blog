import { Author } from "@/types";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { GetAccountFromProvider } from "aleph-sdk-ts/dist/accounts/solana";
import { Get as getAggregate, Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";

interface AlephResponseAuthor {
    [key: string]: {
        username: string;
        createdAt: number;
        bio: string;
        uri: string;
    };
}

export async function getAuthorDetails(publicKey: PublicKey): Promise<Author | null> {
    try {
        const authorDetails = await getAggregate<AlephResponseAuthor>({
            keys: [publicKey.toString() + '-author'],
            address: publicKey.toString(),
            APIServer: 'https://api2.aleph.im'
        });

        return authorDetails[publicKey.toString() + '-author']
    } catch (error) {
        return null
    }
}

export async function postAuthorDetails(authorDetails: Author, wallet: WalletContextState): Promise<void> {
    if(wallet.signMessage && wallet.publicKey) {
        const alephAccount = await GetAccountFromProvider({
            signMessage: wallet.signMessage,
            publicKey: wallet.publicKey,
            connected: wallet.connected,
            connect: wallet.connect
        })
        try {
            await publishAggregate({
                account: alephAccount,
                key: wallet.publicKey.toString() + '-author',
                content: authorDetails,
                channel: "own-blog",
                storageEngine: ItemType.inline,
                inlineRequested: true,
                APIServer: "https://api2.aleph.im"
            });
        } catch (error) {
            console.log(error);
        }
    }
}
