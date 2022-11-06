import '../styles/globals.scss'
import type { AppInitialProps, AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import AppHelpersWrapper, { AppHelpers } from '../context/AppHelpers'
import { QueryClient, QueryClientProvider} from 'react-query'
import StoredGameSceneWrapper from 'store/game/GameScene'
import AuthGuard from '@/components/pageGuards/AuthGuard'
import { useEffect } from 'react'
import WindowStyling from '@/components/windowEvents/WindowStyling'
import { GetServerSidePropsContext } from 'next'
import { DocumentContext } from 'next/document'
import StoredBackgroundSceneWrapper from 'store/background/BackgroundScene'

const NON_AUTH_ROUTES = ['/login']

function MyApp({ Component, pageProps, router }: AppProps) {
  const isAuthRoute = !NON_AUTH_ROUTES.includes(router.pathname)
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <StoredGameSceneWrapper>
        <StoredBackgroundSceneWrapper>
          <AppHelpersWrapper>
            <Head>
              <title>Xenta</title>
              <meta name="description" content="Xenta the game" />
              <link rel="icon" href="/logos/xenta.png" />
            </Head>
            <WindowStyling>
              <AuthGuard isAuthRoute={isAuthRoute}>
                <DefaultLayout>
                  <Component {...pageProps} />
                </DefaultLayout>
              </AuthGuard>
            </WindowStyling>
          </AppHelpersWrapper>
        </StoredBackgroundSceneWrapper>
      </StoredGameSceneWrapper>
    </QueryClientProvider>
  )
}

export default MyApp
