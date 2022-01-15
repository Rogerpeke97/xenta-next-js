import type react from 'react'
import { faUser, faHome, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationCard from '../../atoms/navigation/NavigationCard'
import { useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../../context/AppContextHelpers'



const SideBarMenus = () => {

  const menus = [
    {text: 'Home', icon: faHome},
    {text: 'Profile', icon: faUser},
    {text: 'Settings', icon: faCog},
    {text: 'Log out', icon: faSignOutAlt}
  ]

	const { currentMenu, setCurrentMenu, setShowSideBar } = useContext(AppContextHelpers)

  const updateMenu = (menu: Number) => {
    if(menu !== currentMenu){
      setShowSideBar(false)
      setCurrentMenu(menu)
    }
  }

  return (
    <div className="flex flex-col py-7 pl-5">
      {menus.map((menu, index)=> {
        return (
          <NavigationCard 
            active={index === currentMenu}
            text={menu.text} 
            icon={menu.icon} 
            key={index} 
            onClick={() => updateMenu(index)}
          />
        )
      })}
    </div>
  )
}


export default SideBarMenus