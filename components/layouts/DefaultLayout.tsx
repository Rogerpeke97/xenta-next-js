import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Login from '../../pages/login'
import { UserServicer } from '../../services/user/User'
import Toast from '../atoms/notifications/Toast'
import Overlay from '../overlays/Overlay'
import NavigationLayout from './NavigationLayout'

const DefaultLayout = ({ children }: { children: React.ReactElement }) => {

  const MINUTES = 1
  const REFRESH_TOKEN_EVERY = MINUTES * (60 * 1000)
  const { setWindowWidth, setShowSideBar, showSideBar, isAuthenticated, toast } = AppHelpers()
  const { pingUser, isServiceReady } = UserServicer()
  const [refreshTokenInterval, setRefreshTokenInterval] = useState<NodeJS.Timer>()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  async function checkIfAuthenticated() {
    setIsLoading(true)
    if (!isServiceReady) return
    await pingUser()
    setIsLoading(false)
  }
  const onResize = () => {
    const windowSize = {
      description: window.innerWidth <= 1200 ? 'mobile' : 'desktop', size: window.innerWidth
    }
    const showSideBarForced = showSideBar.forced && showSideBar.show
    setViewHeightCssVar()
    setWindowWidth(windowSize)
    if (windowSize.description === 'desktop') {
      setShowSideBar({ show: true, forced: false })
      return
    }
    if(!showSideBarForced){
      setShowSideBar({ show: false, forced: false })
    }
  }
  function setWindowListener() {
    setWindowWidth({ description: window.innerWidth <= 1200 ? 'mobile' : 'desktop', size: window.innerWidth })
    window.addEventListener('resize', onResize)
  }
  const showLoginOrHome = () => {
    if (!isAuthenticated) {
      return <Login />
    }
    return (
      <NavigationLayout>
        {children}
      </NavigationLayout>
    )
  }
  const setViewHeightCssVar = () => {
    const viewHeight = window.innerHeight
    const viewWidth = window.innerWidth
    document.documentElement.style.setProperty('--vh', `${viewHeight}px`)
    document.documentElement.style.setProperty('--vw', `${viewWidth}px`)
  }
  const displayToast = () => {
    if (!toast || !toast.displayToast) return
    return (
      toast.messages.map((message: string, index: number) => <Toast key={index} text={message.message} type={message.type} />)
    )
  }
  useEffect(() => {
    setViewHeightCssVar()
  }, [])
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
  }, [router.pathname, isServiceReady, showSideBar])

  return (
    <>
      <div className="device-height smooth-render-long">
        <Overlay isLoading={isLoading} />
        {showLoginOrHome()}
      </div>
      <div id="modal"/>
      {displayToast()}
    </>
  )
}
export default DefaultLayout
