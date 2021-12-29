import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import Divider from '../../atoms/dividers/Divider'
import SideBarMenus from './SideBarMenus'

interface NavProps {
  name: string
}

const SideBar: react.FC<NavProps> = ({ name }) => {
  return (
		<nav className="flex w-60">
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