import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import Divider from '../../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'
import { useContext, useEffect, useState } from 'react'
import { NavigationMenuState } from '../../../context/NavigationMenuState'

interface NavProps {
  name: string,
}

const SideBar: react.FC<NavProps> = ({ name }) => {

  const { windowWidth, showSideBar, setShowSideBar } = useContext(NavigationMenuState)

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