import { ItemType } from "aleph-sdk-ts/dist/messages/message";
import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { Publish as publishPost } from 'aleph-sdk-ts/dist/messages/post';
import { ImportAccountFromPrivateKey } from 'aleph-sdk-ts/dist/accounts/ethereum'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.MESSAGES_KEY) return res.send({
    error: "env undefined",
});
  const token = await getToken({ req });
  console.log(token)
  if (!token || !token.sub)
    return res.send({
        error: "User wallet not authenticated",
    });

  const account = ImportAccountFromPrivateKey(JSON.parse(process.env.MESSAGES_KEY))
  console.log(account)
  /*const post =   await getPost({
      types: 'ReducedAuthor',
      pagination: 200,
      page: 1,
      refs: [],
      addresses: [],
      tags: [],
      hashes: [AUTHORS_POST_HASH],
      APIServer: "https://api2.aleph.im"
  })*/
  const content = []
  // content.push(...post.content, req.body)
  content.push(JSON.parse(req.body))
  console.log(content)

  const post = await publishPost({
    account,
    postType: 'amend',
    content, 
    channel: 'own-blog',
    APIServer: 'https://api2.aleph.im',
    inlineRequested: true,
    storageEngine: ItemType.inline
  })
  console.log(post)

  return res.send({
    content:
      "This is protected content. You can access this content because you are signed in with your Solana Wallet.",
  });
}