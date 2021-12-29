import type react from 'react'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'
import IconButton from '../../atoms/buttons/IconButton'

interface NavProps {
  name: string
}

const NavigationBar: react.FC<NavProps> = ({ name }) => {
  return (
		<nav className="flex h-24 w-full px-5">
      <div className="w-full flex bg-background rounded-lg">
        <div className="h-full flex grow content-center">
          <div className="pl-4 flex justify-center items-center">
            {name}
          </div>
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