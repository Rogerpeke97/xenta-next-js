import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Login from '../../pages/login'
import Toast from '../atoms/notifications/Toast'
import Overlay from '../overlays/Overlay'
import NavigationLayout from './NavigationLayout'

export default function DefaultLayout({ children }: { children: React.ReactElement }) {
  const MINUTES = 1
  const REFRESH_TOKEN_EVERY = MINUTES * (60 * 1000)
  const { setIsAuthenticated, setWindowWidth, setShowSideBar, isAuthenticated, toast, api } = AppHelpers()
  const [refreshTokenInterval, setRefreshTokenInterval] = useState<NodeJS.Timer>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  async function checkIfAuthenticated() {
    setIsLoading(true)
    if (!api) {
      return
    }
    try {
      const response = await api.get('/api/ping')
      setIsAuthenticated(true)
    }
    catch {
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }

  const onResize = () => {
    const windowSize = {
      description: window.innerWidth < 1024 ? 'small' : 'big', size: window.innerWidth
    }
    setWindowWidth(windowSize)
    if (windowSize.description === 'big') {
      setShowSideBar(true)
      return
    }
    setShowSideBar(false)
  }

  function setWindowListener() {
    setWindowWidth({ description: window.innerWidth < 1100 ? 'small' : 'big', size: window.innerWidth })
    window.addEventListener('resize', onResize)
  }

  const showLoginOrHome = () => {
    if (router.pathname === '/login' || !isAuthenticated) {
      return <Login />
    }
    return (
      <NavigationLayout>
        {children}
      </NavigationLayout>
    )
  }

  const displayToast = () => {
    if(!toast || !toast.displayToast) return
    return (
      toast.messages.map((message: string, index: number) => <Toast key={index} text={message.message} type={message.type} />)
    )
  }

  useEffect(() => {
    setWindowListener()
    checkIfAuthenticated()
    setRefreshTokenInterval(
      setInterval(() => {
        checkIfAuthenticated()
      }, REFRESH_TOKEN_EVERY)
    )
    return () => {
      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval)
      }
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname, api])

  return (
    <>
      <div className="h-screen smooth-render-long">
        <Overlay isLoading={isLoading} />
        {showLoginOrHome()}
      </div>
      { displayToast() }
    </>
  )
}