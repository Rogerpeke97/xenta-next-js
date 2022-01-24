import react from 'react'
import { useContext, useEffect } from 'react'
import { AppContextHelpers } from '../../../context/AppContextHelpers'




const MenuContent = ({ children }: { children: React.ReactElement }) => {


  const screens = [
    { name: 'home', component: children, index: 0},
    { name: 'profile', component: children, index: 1},
    { name: 'settings', component: children, index: 2},
    { name: 'logout', component: children, index: 3},
  ]

  const { currentMenu } = useContext(AppContextHelpers)

  const loadContent = (): JSX.Element => {
    const findScreen = screens.find(screen => screen.index === currentMenu)
    if(!findScreen){
      return <div>Not Found</div>
    }
    return findScreen.component
  }

  return (
    <div className="overflow-y-auto px-5 pt-6">
      {loadContent()}
    </div>
  )
}

export default MenuContent