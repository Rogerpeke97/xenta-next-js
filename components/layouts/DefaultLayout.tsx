import Router, { useRouter } from 'next/router'
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { usePingUser } from 'services/user/User'
import { AppHelpers } from '../../context/AppHelpers'
import Login from '../../pages/login'
import Toast from '../atoms/notifications/Toast'
import Overlay from '../molecules/overlays/Overlay'
import NavigationLayout from './NavigationLayout'

const DefaultLayout = ({ children }: { children: React.ReactElement }) => {
  const { setWindowWidth, setShowSideBar, showSideBar, isAuthenticated, toast } = AppHelpers()
  const { isLoading, data } = usePingUser()
  const setViewHeightCssVar = () => {
    const viewHeight = window.innerHeight
    const viewWidth = window.innerWidth
    document.documentElement.style.setProperty('--vh', `${viewHeight}px`)
    document.documentElement.style.setProperty('--vw', `${viewWidth}px`)
  }
  const onWindowResize = useCallback(() => {
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
  }, [showSideBar])
  const setWindowListener = () => {
    setWindowWidth({ description: window.innerWidth <= 1200 ? 'mobile' : 'desktop', size: window.innerWidth })
    window.addEventListener('resize', onWindowResize)
  }
  const displayToast = () => {
    if (!toast || !toast.displayToast) return
    return (
      toast.messages.map((message: string, index: number) => <Toast key={index} text={message.message} type={message.type} />)
    )
  }
  useEffect(() => {
    setViewHeightCssVar()
    setWindowListener()
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="device-height smooth-render-long">
        <Overlay isLoading={isLoading} />
        {
          (!isAuthenticated && !isLoading || data?.error) ? <Login />
            : <NavigationLayout>
                {children}
              </NavigationLayout>
        }
      </div>
      <div id="modal"/>
      {displayToast()}
    </>
  )
}
export default DefaultLayout
