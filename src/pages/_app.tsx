import { Layout } from '@/components'
import { ContextProvider } from '@/contexts'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import NotificationsContainer from '@/components/Notification'
import { NotificationProvider } from '@/contexts/NotificationContext'

export default function App({ Component, pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <ContextProvider>
      <SessionProvider 
        session={pageProps.session}
        refetchInterval={5 * 60}
        refetchOnWindowFocus={true}
      >
        <NotificationProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <NotificationsContainer />
        </NotificationProvider>
      </SessionProvider>
    </ContextProvider>
  )
}
