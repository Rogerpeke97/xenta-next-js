import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Divider from '../../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'
import { useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../../context/AppContextHelpers'

interface NavProps {
  name: string,
}

const SideBar: react.FC<NavProps> = ({ name }) => {

  const { windowWidth, showSideBar, setShowSideBar } = useContext(AppContextHelpers)

  const displaySideBarMobile = () => {
    const display = showSideBar
    if (display) {
      return 'show-side-bar-mobile flex w-full absolute z-50'
    }
    else{
      return 'hidden'
    }
  }

  const whichSideBarContent = () => {
    if (windowWidth.description === 'small') {
      return (
        <nav className={`${displaySideBarMobile()}`}>
          <div className="h-screen w-full bg-background rounded-lg">
            <div className="h-24 flex items-center justify-between">
              <h3 className="pl-6 subtitle-1 font-bold">
                {name}
              </h3>
              <div className="pr-6">
                <FontAwesomeIcon icon={faTimes} className="icon" onClick={()=>setShowSideBar(false)} />
              </div>
            </div>
            <Divider color={"grey"} />
            <SideBarMenus />
          </div>
        </nav>
      )
    }
    else {
      return (
        <nav className="flex w-60 show-side-bar">
          <div className="h-screen w-full bg-background rounded-lg">
            <div className="h-24 flex items-center justify-center">
              <h3 className="subtitle-1 font-bold">
                {name}
              </h3>
            </div>
            <Divider color={"grey"} />
            <SideBarMenus />
          </div>
        </nav>
      )
    }
  }

  return (
    whichSideBarContent()
  )
}


export default SideBar