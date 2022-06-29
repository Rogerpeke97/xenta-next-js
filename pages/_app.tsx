import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import AppHelpersWrapper, { AppHelpers } from '../context/AppHelpers'
import ApiServiceWrapper from '../services/api/ApiService'
import { QueryClient, QueryClientProvider} from 'react-query'

function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <AppHelpersWrapper>
        <ApiServiceWrapper>
          <Head>
            <title>Xenta</title>
            <meta name="description" content="Xenta the game" />
            <link rel="icon" href="/logos/xenta.png" />
          </Head>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </ApiServiceWrapper>
      </AppHelpersWrapper>
    </QueryClientProvider>
  )
}

export default MyApp
