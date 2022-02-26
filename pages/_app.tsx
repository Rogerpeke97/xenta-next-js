import '../styles/globals.css'
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layouts/DefaultLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { AppContextHelpers } from '../context/AppContextHelpers'
import Api from './api/Api'
import { useRouter } from 'next/router'
import Toast from '../components/atoms/notifications/Toast'
import Overlay from '../components/overlays/Overlay'
import NavigationLayout from '../components/layouts/NavigationLayout'
import Login from './login'

interface Lives {
  index: number;
  isActive: boolean;
}

interface GameHelpers {
  lives: Array<Lives>;
  setLives: (lives: Array<Lives>) => void;
  intervalIds: Array<number>;
  isCharacterBeingHit: boolean;
  resetFields: () => void;
  gameInterval: NodeJS.Timeout;
}

function MyApp({ Component, pageProps }: AppProps) {


  const [api, setApi] = useState<Api>()

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true);

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState({ description: '', size: 0 })

  const [showSideBar, setShowSideBar] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [refreshTokenInterval, setRefreshTokenInterval] = useState<NodeJS.Timer>()

  const [gameHelpers, setGameHelpers] = useState<GameHelpers>({
    lives: [
      { index: 0, isActive: true },
      { index: 1, isActive: true },
      { index: 2, isActive: true }
    ],
    setLives: (lives: Array<Lives>) => {
      setGameHelpers({ ...gameHelpers, lives })
    },
    isCharacterBeingHit: false,
    intervalIds: [],
    resetFields: () => {
      gameHelpers.intervalIds.forEach((id, index) => {
        clearInterval(id)
      })
      gameHelpers.intervalIds = []
      setGameHelpers({
        ...gameHelpers,
        lives: [
          { index: 0, isActive: true },
          { index: 1, isActive: true },
          { index: 2, isActive: true }
        ],
        isCharacterBeingHit: false,
        gameInterval: null
      })
    },
    gameInterval: null
  })

  const [toast, setToast] = useState({
    messages: [{message: '', type: ''}],
    displayToast: false
  })

  async function checkIfAuthenticated(apiInit: Api){
    try{
      const response = await apiInit.get('/api/ping')
      if (response.error) {
        setIsAuthenticated(false)
        router.push('login')
        return
      }
      setIsAuthenticated(true)
      if(router.pathname === '/login') {
        router.push('/')
        return
      }
    }
    catch{
      router.push('login')
      setIsAuthenticated(false)
    }
  }

  function setWindowListener() {
    setWindowWidth({ description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth })
    window.addEventListener('resize', () => {
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
    })
  }

  const REFRESH_TOKEN_EVERY = 900000


  useEffect(() => {
    setWindowListener()
    const apiInit = new Api()
    setApi(apiInit)
    checkIfAuthenticated(apiInit)
    setRefreshTokenInterval(
      setInterval(() => {
        checkIfAuthenticated(apiInit)
      }, REFRESH_TOKEN_EVERY)
    )
    setIsLoading(false)
    return () => {
      if(refreshTokenInterval){
        clearInterval(refreshTokenInterval)
      }
      window.removeEventListener('resize', () => { })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname])

  function displayComponent(){
    if(isLoading){
      return <Overlay isLoading={isLoading}/>
    }
    return <Component {...pageProps} />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Xenta</title>
        <meta name="description" content="Xenta the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppContextHelpers.Provider value={{ isAuthenticated, currentMenu, gameHelpers, setGameHelpers,
        setCurrentMenu, windowWidth, showSideBar, setShowSideBar, api, setToast }}>
        {!isAuthenticated ? 
          (router.pathname === '/login' && !isLoading) && <Login /> :
          <NavigationLayout>
            {displayComponent()}
          </NavigationLayout>
        }
        {toast.displayToast && toast.messages.map((message, index) => <Toast key={index} text={message.message} type={message.type} />)}
      </AppContextHelpers.Provider>
    </DefaultLayout>
  )

}

export default MyApp
