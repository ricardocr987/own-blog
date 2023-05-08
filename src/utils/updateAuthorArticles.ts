import { GetUserResponse, Post, ReducedPost } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { messagesAddress } from "@/constants";

// updates the post with the vector that contains all the reduced posts info
export async function updateAuthorArticles(
    account: SOLAccount,
    authorPubkey: string,
    postId: string,
) {
    const response = await getAggregate<GetUserResponse>({
        keys: [authorPubkey],
        address: messagesAddress,
        APIServer: 'https://api2.aleph.im'
    });
    response[authorPubkey].articles = [...response[authorPubkey].articles, postId]
    
    await publishAggregate({
        account: account,
        key: authorPubkey,
        content: response[authorPubkey],
        channel: "own-blog",
        storageEngine: ItemType.inline,
        inlineRequested: true,
        APIServer: "https://api2.aleph.im"
    })
}