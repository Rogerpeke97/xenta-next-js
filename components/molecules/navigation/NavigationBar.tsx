import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconButtonLink from '@/components/atoms/buttons/IconButtonLink'
import { AppHelpers } from 'context/AppHelpers'

const NavigationBar = () => {

  const { windowWidth, setShowSideBar } = AppHelpers()
  const leftSide = () => {
    if (windowWidth.description === "mobile") {
      return (
        <div className="flex pl-5 flex-col items-center justify-center">
          <FontAwesomeIcon className="icon cursor-pointer" icon={faBars} 
            onClick={() => setShowSideBar({ show: true, forced: true })} />
        </div>
      )
    }
    return
  }

  return (
    <nav className="flex w-full px-5" style={{ minHeight: '120px' }}>
      <div className="w-full flex bg-background rounded-lg">
        <div className="h-full flex grow content-center">
          {leftSide()}
        </div>
        <div className="flex grow align-center px-5">
          <div className="flex grow justify-end items-center">
            <IconButtonLink iconName={faGithub} link={"https://github.com/Rogerpeke97"} iconSize={'iconRegular'} />
          </div>
        </div>
      </div>
    </nav>
  )
}


export default NavigationBar