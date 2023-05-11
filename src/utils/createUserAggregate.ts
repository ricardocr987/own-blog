import { Author } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';

export async function createUserAggregate(
    account: SOLAccount, 
    newUser: Author,
) {
    await publishAggregate({
        account: account,
        key: newUser.pubkey,
        content: newUser,
        channel: "own-blog",
        storageEngine: ItemType.inline,
        inlineRequested: true,
        APIServer: "https://api2.aleph.im"
    })
}