import { Post, ReducedPost } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';

// updates the post with the vector that contains all the reduced posts info
export async function updatePostArticles(
    account: SOLAccount, 
    newPost: Post,
) {
    const post = await getPost<ReducedPost[]>({
        types: 'ReducedPost[]',
        pagination: 200,
        page: 1,
        refs: [],
        addresses: [],
        tags: [],
        hashes: ['da958c60481d83d5b7a10739b2d6c336018531cc797e52637462f245e4b4ba3c'],
        APIServer: "https://api2.aleph.im"
    })
    const content = []
    const previousContent = post.posts[0].content
    content.push(...previousContent, newPost.id)
    return await publishPost({
        account,
        postType: 'amend',
        content: [content], 
        channel: 'own-blog',
        APIServer: 'https://api2.aleph.im',
        inlineRequested: true,
        storageEngine: ItemType.inline,
    })
}