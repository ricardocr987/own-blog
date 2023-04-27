import { Envs } from "@/config";
import { messagesAddress } from "@/constants";
import { Post } from "@/types";
import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { Get as getAggregate, Publish as publishAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { ItemType } from "aleph-sdk-ts/dist/messages/message";

export async function getArticle(id: string): Promise<Post | null> {
    try {
        const postDetails = await getAggregate({
            keys: [id],
            address: messagesAddress,
            APIServer: 'https://api2.aleph.im'
        }) as Post

        return postDetails
    } catch (error) {
        return null
    }
}

export async function postArticle(id: string, postDetails: Post): Promise<void> {
    try {
        await publishAggregate({
            account: ImportAccountFromPrivateKey(new Uint8Array(Envs.OWN_BLOG_KEY.split(',').map(str => parseInt(str.trim())))),
            key: id,
            content: postDetails,
            channel: "own-blog",
            storageEngine: ItemType.inline,
            inlineRequested: true,
            APIServer: "https://api2.aleph.im"
        });
    } catch (error) {
        console.log(error);
    }
}
