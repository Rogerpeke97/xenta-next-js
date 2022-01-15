import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import IconButton from '../../atoms/buttons/IconButton'
import { AppContextHelpers } from '../../../context/AppContextHelpers'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface NavProps {
  name: string,
  sideBar: [boolean, Function]
}

const NavigationBar: react.FC<NavProps> = ({ name, sideBar }) => {

  const { windowWidth } = useContext(AppContextHelpers)

  const [showSideBar, setShowSideBar] = sideBar

  const leftSide = () => {
    if (windowWidth.description === "small") {
      return (
        <div className="flex pl-5 flex-col items-center justify-center">
          <FontAwesomeIcon className="icon" icon={faBars} onClick={()=>setShowSideBar(!showSideBar)} />
        </div>
      )
    }
    else {
      return (
        <div className="pl-4 flex justify-center items-center">
          {name}
        </div>
      )
    }
  }


  return (
    <nav className="flex h-24 w-full px-5">
      <div className="w-full flex bg-background rounded-lg">
        <div className="h-full flex grow content-center">
          {leftSide()}
        </div>
        <div className="flex grow align-center px-5">
          <div className="flex grow justify-end items-center">
            <IconButton iconName={faGithub} link={"https://github.com/Rogerpeke97"} iconSize={'iconRegular'} />
          </div>
        </div>
      </div>
    </nav>
  )
}


export default NavigationBar