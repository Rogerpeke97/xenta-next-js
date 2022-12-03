import type react from 'react'
import { faUser, faHome, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { AppHelpers } from 'context/AppHelpers'
import NavigationCard from '@/components/atoms/navigation/NavigationCard'



const SideBarMenus = () => {

  const router = useRouter()
  const menus = [
    {text: 'Home', icon: faHome, route: '/'},
    {text: 'Profile', icon: faUser, route: '/profile'},
    {text: 'Settings', icon: faCog, route: '/settings'},
    {text: 'Log out', icon: faSignOutAlt, route: '/logout'}
  ]
	const { currentMenu, setCurrentMenu, setShowSideBar, isAuthenticated } = AppHelpers()

  const findValidIndex = () => {
    const INDEX_NOT_FOUND = -1
    const menuIndex = menus.findIndex(menu => menu.route === router.pathname)
    const loginRoute = router.pathname === '/login'
    if(loginRoute && isAuthenticated){
      return 0
    }
    if(menuIndex !== INDEX_NOT_FOUND){
      return menuIndex
    }
    return INDEX_NOT_FOUND
  } 

  const updateMenu = (menu: number) => {
    setCurrentMenu(menu)
    const menuRoute = menus[menu]?.route
    if(!menuRoute) return
    router.push(menuRoute)
    setShowSideBar({ show: false, forced: true })
  }

  useEffect(() => {
    const menuIndex = findValidIndex()
    updateMenu(menuIndex)
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