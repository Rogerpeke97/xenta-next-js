import '../styles/globals.css'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { AppContextHelpers } from '../context/AppContextHelpers'
import Api from './api/Api'
import { useRouter } from 'next/router'
import Toast from '../components/atoms/notifications/Toast'

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter()

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState({ description: '', size: 0 })

  const [showSideBar, setShowSideBar] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [toast, setToast] = useState({
    messages: [{message: '', type: ''}],
    displayToast: false
  })

  const api = new Api()

  const isUserLoggedIn = async () => {
    try{
      const response = await api.get('/ping')
      console.log(response.error)
      if (!response.ok) {
        router.push('login')
      }
      else{
        setIsAuthenticated(false)
      }
    }
    catch{
      router.push('login')
    }
  }


  function main() {
    setWindowWidth({ description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth })
    window.addEventListener('resize', () => {
      setWindowWidth(() => {
        const windowSize = {
          description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth
        }
        if (windowSize.description === 'big') {
          setShowSideBar(false)
        }
        return windowSize
      })
    })
    isUserLoggedIn()
  }

  useEffect(() => {
    main()
    return () => {
      window.removeEventListener('resize', () => { })
    }
  }, [])


  return (
    <DefaultLayout>
      <Head>
        <title>Xenta</title>
        <meta name="description" content="Xenta the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContextHelpers.Provider value={{ isAuthenticated, currentMenu, setCurrentMenu, windowWidth, showSideBar, setShowSideBar, api, setToast }}>
        <Component {...pageProps} />
        {toast.displayToast && toast.messages.map((message, index) => <Toast key={index} text={message.message} type={message.type} />)}
      </AppContextHelpers.Provider>
    </DefaultLayout>
  )
}

export default MyApp
