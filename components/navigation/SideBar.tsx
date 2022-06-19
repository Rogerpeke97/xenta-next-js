import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Divider from '../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'
import { useCallback, useRef, useState } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Image from 'next/image'

const SideBar= () => {

  const { windowWidth, showSideBar, setShowSideBar } = AppHelpers()
  const sideBar = useRef<HTMLDivElement>(null)
  const currentSideBarClass = useRef<string>('')
  const classForSideBar = useCallback(() => {
    const sideBarWidth = sideBar.current?.clientWidth
    const isSideBarHidden = sideBarWidth === 0
    const showSideBarForced = showSideBar.forced && showSideBar.show
    const hideSideBarForced = !showSideBar.show && showSideBar.forced
    const hideSideBarNotForced = !showSideBar.show && !showSideBar.forced
    const isMobile = windowWidth.description === 'mobile'
    if(isMobile){
      if(showSideBarForced && isSideBarHidden){
        currentSideBarClass.current = 'show-side-bar-mobile flex w-full absolute z-50'
      }
      if (hideSideBarNotForced && !isSideBarHidden) {
        currentSideBarClass.current = 'absolute hide-side-bar-mobile'
      }
      if(hideSideBarForced){
        currentSideBarClass.current = 'flex absolute z-50 collapse-menu'
      }
    }
    else{
      currentSideBarClass.current = 'flex w-60 show-side-bar expand'
    }
    return currentSideBarClass.current
  }, [showSideBar, windowWidth])

  return (
    <nav ref={sideBar} className={`h-full ${classForSideBar()}`}>
      <div className="h-full w-full bg-background rounded-lg">
        <div className="h-24 flex items-center mdAndDown:justify-between justify-center">
          <Image priority={true} src="/logos/xenta.png" width={80} height={80} alt="profile-pic" />
          {windowWidth.description === 'mobile' && (
            <div className="pr-6">
              <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer" 
                onClick={() => setShowSideBar({ show: false, forced: true })} />
            </div>
          )}
        </div>
        <Divider className="pt-3" color={"grey"} />
        <SideBarMenus />
      </div>
    </nav>
  )
}


export default SideBar