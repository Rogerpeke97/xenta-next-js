import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Divider from '../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'
import { useCallback, useRef } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Image from 'next/image'

const SideBar= () => {

  const { windowWidth, showSideBar, setShowSideBar } = AppHelpers()

  const sideBar = useRef<HTMLDivElement>(null)

  const classForSideBar = useCallback(() => {
    const sideBarWidth = sideBar.current?.clientWidth
    if(windowWidth.description === 'small'){
      if(showSideBar){
        if(sideBarWidth === windowWidth.size || sideBarWidth === 0){
          return 'show-side-bar-mobile flex w-full absolute z-50'
        }
      }
      if (sideBarWidth) {
        if (sideBarWidth === windowWidth.size) {
          return 'flex absolute z-50 collapse-menu'
        }
        if (sideBarWidth > 0) {
          return 'absolute hide-side-bar-mobile'
        }
      }
      return 'absolute hidden'
    }
    else{
      if (sideBarWidth === 0) {
        return 'flex w-60 show-side-bar expand'
      }
      return 'flex w-60 show-side-bar'
    }
  }, [showSideBar, windowWidth])

  return (
    <nav ref={sideBar} className={`h-full ${classForSideBar()}`}>
      <div className="h-full w-full bg-background rounded-lg">
        <div className="h-24 flex items-center mdAndDown:justify-between justify-center">
          <Image priority={true} src="/logos/xenta.png" width={80} height={80} alt="profile-pic" />
          {windowWidth.description === 'small' && (
            <div className="pr-6">
              <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer" onClick={() => setShowSideBar(false)} />
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