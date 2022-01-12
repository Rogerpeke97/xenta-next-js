import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import Divider from '../../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'
import { useContext, useState } from 'react'
import { NavigationMenuState } from '../../../context/NavigationMenuState'

interface NavProps {
  name: string
}

const SideBar: react.FC<NavProps> = ({ name }) => {

  const { windowWidth } = useContext(NavigationMenuState)

  const [isOpen, setIsOpen] = useState(false)

  return (
		<nav className={`flex w-60 ${windowWidth === 'small' ? 'hide-side-bar' : 'show-side-bar'}`}>
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


export default SideBar