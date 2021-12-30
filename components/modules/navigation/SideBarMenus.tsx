import type react from 'react'
import { faUser, faHome, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationCard from '../../atoms/navigation/NavigationCard'
import { useContext, useState } from 'react'
import { NavigationMenuState } from '../../../context/NavigationMenuState'



const SideBarMenus = () => {

  const menus = [
    {text: 'Home', icon: faHome},
    {text: 'Profile', icon: faUser},
    {text: 'Settings', icon: faCog},
    {text: 'Log out', icon: faSignOutAlt}
  ]

	const { currentMenu, setCurrentMenu } = useContext(NavigationMenuState)

  return (
    <div className="flex flex-col py-7 pl-5">
      {menus.map((menu, index)=> {
        return (
          <NavigationCard 
            active={index === currentMenu}
            text={menu.text} 
            icon={menu.icon} 
            key={index} 
            onClick={() => setCurrentMenu(index)}
          />
        )
      })}
    </div>
  )
}


export default SideBarMenus