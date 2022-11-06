import { AppHelpers } from "context/AppHelpers"
import { useCallback, useEffect } from "react"


const WindowStyling = ({ children }: { children: React.ReactElement }) => {
  const { setWindowWidth, setShowSideBar, showSideBar } = AppHelpers()
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
    if (!showSideBarForced) {
      setShowSideBar({ show: false, forced: false })
    }
  }, [showSideBar])
  const setWindowListener = () => {
    setWindowWidth({ description: window.innerWidth <= 1200 ? 'mobile' : 'desktop', size: window.innerWidth })
    window.addEventListener('resize', onWindowResize)
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
      {children}
    </>
  )
}

export default WindowStyling
