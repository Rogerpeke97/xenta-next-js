import type react from 'react'
import { faUser, faHome, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavigationCard from '../atoms/navigation/NavigationCard'
import { useEffect } from 'react'
import Router from 'next/router'
import { AppHelpers } from '../../context/AppHelpers'



const SideBarMenus = () => {

  const menus = [
    {text: 'Home', icon: faHome, route: '/'},
    {text: 'Profile', icon: faUser, route: '/profile'},
    {text: 'Settings', icon: faCog, route: '/settings'},
    {text: 'Log out', icon: faSignOutAlt, route: '/logout'}
  ]

	const { currentMenu, setCurrentMenu, setShowSideBar } = AppHelpers()

  const updateMenu = (menu: number) => {
    if(menu !== currentMenu){
      setCurrentMenu(menu)
    }
    setShowSideBar(false)
    const menuRoute = menus[menu]?.route
    if(!menuRoute) return
    Router.push(menuRoute)
  }

  useEffect(() => {
    updateMenu(menus.findIndex(menu => menu.route === Router.pathname))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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