import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import AppHelpersWrapper, { AppHelpers } from '../context/AppHelpers'
import ApiServiceWrapper from '../services/ApiService'
import UserServiceWrapper from '../services/user/User'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppHelpersWrapper>
      <ApiServiceWrapper>
        <UserServiceWrapper>
          <Head>
            <title>Xenta</title>
            <meta name="description" content="Xenta the game" />
            <link rel="icon" href="/logos/xenta.png" />
          </Head>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </UserServiceWrapper>
      </ApiServiceWrapper>

    </AppHelpersWrapper>
  )
}

export default MyApp
