import react from 'react'
import { useContext, useEffect } from 'react'
import { AppContextHelpers } from '../../../context/AppContextHelpers'
import Home from './home/Home'





const MenuContent = () => {
  const screens = [
    { name: 'Home', component: <Home />, index: 0 },
  ]

  const { currentMenu } = useContext(AppContextHelpers)

  const loadContent = (): JSX.Element => {
    const findScreen = screens.find(screen => screen.index === currentMenu)
    return findScreen?.component ?? <div>Not Found</div>
  }

  return (
    <div className="h-full px-5 pt-6">
      {loadContent()}
    </div>
  )
}

export default MenuContent