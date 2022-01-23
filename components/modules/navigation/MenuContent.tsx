import react from 'react'
import { useContext, useEffect } from 'react'
import { AppContextHelpers } from '../../../context/AppContextHelpers'




const MenuContent = ({ children }: { children: React.ReactElement }) => {


  const screens = [
    { name: 'home', component: children, index: 0},
    { name: 'profile', component: children, index: 1},
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
    <div className="h-full px-5 pt-6">
      {loadContent()}
    </div>
  )
}

export default MenuContent