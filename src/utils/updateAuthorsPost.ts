import { Author, ReducedAuthor, UsernameAndPubkey } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

export async function updateAuthorsPost(
    account: SOLAccount, 
    newUser: Author,
    previousContent: UsernameAndPubkey[]
) {
    try {
        await publishPost({
            account,
            postType: 'amend',
            ref: 'e20405765ee6eff946c34803e3be913124181f9a10ba3d736c93178f459e32a7',
            content: [
                ...previousContent,
                { id: newUser.pubkey, username: newUser.username }
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