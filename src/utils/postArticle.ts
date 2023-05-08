import { Post } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';

export async function postArticle(
    account: SOLAccount, 
    newPost: Post,
) {
    try {
        await publishAggregate({
            account: account,
            key: newPost.id,
            content: newPost,
            channel: "own-blog",
            storageEngine: ItemType.inline,
            inlineRequested: true,
            APIServer: "https://api2.aleph.im"
        })
    } catch (error) {
        console.log(error)
    }
}