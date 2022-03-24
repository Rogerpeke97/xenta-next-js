import '../styles/globals.css'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Toast from '../components/atoms/notifications/Toast'
import Overlay from '../components/overlays/Overlay'
import NavigationLayout from '../components/layouts/NavigationLayout'
import Login from './login'
import Api from './api/Api'
import AppHelpersWrapper, { AppHelpers } from '../context/AppHelpers'

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true);

  const [refreshTokenInterval, setRefreshTokenInterval] = useState<NodeJS.Timer>()

  const { setIsAuthenticated, setWindowWidth, setShowSideBar, setToast, isAuthenticated, toast, api } = AppHelpers()

  const appHelpers = AppHelpers()

  async function checkIfAuthenticated() {
    try {
      const response = await api.get('/api/ping')
      if (response.error) {
        setIsAuthenticated(false)
        router.push('login')
        return
      }
      setIsAuthenticated(true)
      if (router.pathname === '/login') {
        router.push('/')
        return
      }
    }
    catch {
      router.push('login')
      setIsAuthenticated(false)
    }
  }

  const onResize = useCallback(() => {
    setWindowWidth(() => {
      const windowSize = {
        description: window.innerWidth < 1024 ? "small" : "big", size: window.innerWidth
      }
      if (windowSize.description === 'big') {
        setShowSideBar(true)
      }
      else {
        setShowSideBar(false)
      }
      return windowSize
    })
  }, [router.pathname])

  function setWindowListener() {
    // setWindowWidth({ description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth })
    window.addEventListener('resize', onResize)
  }

  const REFRESH_TOKEN_EVERY = 1 * (60 * 1000)

  useEffect(() => {
    console.log(toast)
  }, [toast])

  useEffect(() => {
    console.log(appHelpers)
    setWindowListener()
    checkIfAuthenticated()
    setRefreshTokenInterval(
      setInterval(() => {
        checkIfAuthenticated()
      }, REFRESH_TOKEN_EVERY)
    )
    setIsLoading(false)
    return () => {
      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval)
      }
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, appHelpers])

  const displayComponent = useCallback(() => {
    if (isLoading) {
      return (
        <Overlay isLoading={isLoading} />
      )
    }
    return <Component {...pageProps} />
  }, [isLoading, pageProps])

  return (
    <DefaultLayout>
      <Head>
        <title>Xenta</title>
        <meta name="description" content="Xenta the game" />
        <link rel="icon" href="/logos/xenta.png" />
      </Head>
      <>
        {!isAuthenticated ?
          (router.pathname === '/login' && !isLoading) && <Login /> :
          <NavigationLayout>
            {displayComponent()}
          </NavigationLayout>
        }
        {toast && toast.displayToast && toast.messages.map((message, index) => <Toast key={index} text={message.message} type={message.type} />)}
      </>
    </DefaultLayout>
  )

}

export default MyApp
