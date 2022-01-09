import '../styles/globals.css'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Head>
        <title>Xenta</title>
        <meta name="description" content="Xenta the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </DefaultLayout>
  )
}

export default MyApp
