import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SigninMessage } from "../../../utils/SignMessage";
import { getUrl } from "@/utils/checkEnvironment";
import { Author } from "@/types";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || getUrl());

          if (signinMessage.domain !== nextAuthUrl.href) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          return {
            id: signinMessage.publicKey,
            username: signinMessage.username,
            uri: signinMessage.uri,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, credentials }) {
      const author: Author = JSON.parse(credentials?.author as string)
      if (account) {
        account.id = author.pubkey
        account.username = author.username
        account.uri = author.uri
      }
      return true
    },
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id
        token.username = account.username
        token.uri = account.uri 
      }
      return token
    },
    async session({ session, token }) {
      session.user.username = token.username
      session.user.uri = token.uri
      session.user.id = token.id

      return session
    },
  },
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}