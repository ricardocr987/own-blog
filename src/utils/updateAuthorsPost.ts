import { Author, ReducedAuthor } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

export async function updateAuthorsPost(
    account: SOLAccount, 
    newUser: Author,
    previousContent: ReducedAuthor[]
) {
    try {
        await publishPost({
            account,
            postType: 'amend',
            ref: '3bf745986fdeaab767f254a3c727e4a7a0f1eabcfb8a031eadfc81fbfde561d2',
            content: [
                ...previousContent, 
                { pubkey: newUser.pubkey, username: newUser.username }
            ], 
            channel: 'own-blog',
            APIServer: 'https://api2.aleph.im',
            inlineRequested: true,
            storageEngine: ItemType.inline
        })
    } catch (error) {
        console.log(error)
    }
}