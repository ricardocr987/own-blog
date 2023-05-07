import { Layout } from '@/components'
import { ContextProvider } from '@/contexts'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <ContextProvider>
      <SessionProvider 
        session={pageProps.session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ContextProvider>
  )
}
