import { Post, ReducedPost } from "@/types"
import { SOLAccount } from "aleph-sdk-ts/dist/accounts/solana";
import { ItemType } from "aleph-sdk-ts/dist/messages/message"
import { Session } from "next-auth";
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { messagesAddress } from "@/constants";
import { Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';

interface AlephResponseCategory {
    [key: string]: {
        posts: string[]
    };
}

// updates the post with the vector that contains all the reduced post info
export async function updatePostsCategories(
    account: SOLAccount, 
    session: Session,
    newPost: Post,
) {
    const reducedPost: ReducedPost = {
        id: newPost.id,
        title: newPost.title,
        author: {
            username: session?.user.username || newPost.author.username,
            id: session?.user.id || newPost.author.id,
            uri: session?.user.uri || newPost.author.uri,
        },
    }
    for (const category of newPost.categories) {
        try {
            const response = await getAggregate<AlephResponseCategory>({
                keys: [category],
                address: messagesAddress,
                APIServer: 'https://api2.aleph.im'
            })
            // if the category already exists
            await publishAggregate({
                account: account,
                key: category,
                content: { posts: [...response[category].posts, newPost.id] },
                channel: "own-blog",
                storageEngine: ItemType.inline,
                inlineRequested: true,
                APIServer: "https://api2.aleph.im"
            })
            console.log(`Post published under category ${category}.`)
        } catch (error) {
            // if the category doesn't exist:
            // updates the category vector with all the categories names
            const post = await getPost<string[]>({
                types: 'string[]',
                pagination: 200,
                page: 1,
                refs: [],
                addresses: [],
                tags: [],
                hashes: ['ae045e57106dfa1149c65829a4d5acf9031db5c0cae1cb00f5c2453e83d105ab'],
                APIServer: "https://api2.aleph.im"
            })
            const previousContent = post.posts[0].content
            await publishPost({
                account,
                postType: 'amend',
                content: [...previousContent, category],
                ref: 'ae045e57106dfa1149c65829a4d5acf9031db5c0cae1cb00f5c2453e83d105ab',
                channel: 'own-blog',
                APIServer: 'https://api2.aleph.im',
                inlineRequested: true,
                storageEngine: ItemType.inline,
            })
            // publishes an category aggregate with the article
            await publishAggregate({
                account: account,
                key: category,
                content: { posts: [reducedPost] },
                channel: "own-blog",
                storageEngine: ItemType.inline,
                inlineRequested: true,
                APIServer: "https://api2.aleph.im"
            })
            console.log(`Post published as new aggregate under category ${category}.`)
        }
    }
}