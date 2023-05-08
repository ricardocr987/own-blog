import { ImportAccountFromPrivateKey } from "aleph-sdk-ts/dist/accounts/solana";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { postArticle } from "@/utils/postArticle";
import { updatePostArticles } from "@/utils/updateAuthorPosts";
import { updateAuthorArticles } from "@/utils/updateAuthorArticles";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    if (!process.env.MESSAGES_KEY) return res.status(500).send('MESSAGES_KEY environment variable not found.');

    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "You must be logged in." });

    try {
        const account = ImportAccountFromPrivateKey(Uint8Array.from(JSON.parse(process.env.MESSAGES_KEY)));
        const newPost = JSON.parse(req.body)

        // updates categories post (if a new one is created) and includes the reduced post info in the category post
        // await updatePostsCategories(account, session, newPost)

        // creates an specific aggregate for the whole article
        await postArticle(account, newPost)

        // updates the post with that contains all the articles ids
        await updatePostArticles(account, newPost)

        // updates author aggregate including the post id
        await updateAuthorArticles(account, session.user.id, newPost.id)

        return res.status(201).send("Post updated correctly");
    } catch (error) {
        console.log('Publish error:', error);
        return res.status(500).send('Internal Server Error.');
    }
}
