import react from 'react'
import { useContext, useEffect } from 'react'
import { NavigationMenuState } from '../../../context/NavigationMenuState'
import Home from './home/Home'





const MenuContent = () => {
  const screens = [
    { name: 'Home', component: <Home />, index: 0 },
  ]

  const { currentMenu } = useContext(NavigationMenuState)

  const loadContent = (): JSX.Element => {
    const findScreen = screens.find(screen => screen.index === currentMenu)
    return findScreen?.component ?? <div>Not Found</div>
  }

  return(
    <div className="h-screen px-6 pt-6">
      {loadContent()}
    </div>
  )
}

export default MenuContent