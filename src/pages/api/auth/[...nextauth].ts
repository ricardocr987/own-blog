import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SigninMessage } from "../../../utils/SignMessage";
import { getUrl } from "@/utils/checkEnvironment";

export function authOptions(req?: NextApiRequest, ctx?: GetServerSidePropsContext): AuthOptions {
  return {
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
            if (signinMessage.domain !== nextAuthUrl.host) return null;
            
            const validationResult = await signinMessage.validate(credentials?.signature || "");
            if (!validationResult) return null;

            /*
              https://next-auth.js.org/getting-started/client#getcsrftoken: 
              You likely only need to use this if you are not using the built-in signIn() and signOut() methods, 
              but i think is needed, gives a different number
              const csrfToken = await getCsrfToken({ req: { ...req, body: null } });
              if (signinMessage.nonce !== csrfToken) return null
            */

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
      async signIn({ account }) {
        if (account) {
          return true
        }
        return false
      },
      async jwt({ token, user }) {
        if (user) {
          token = { ...token, ...user }
        }
        return token
      },
      async session({ session, token }) {
        session.user.username = token.username
        session.user.uri = token.uri
        session.user.id = token.id

        return session
      },
    }
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions(req));
}