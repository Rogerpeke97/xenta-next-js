import react from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import InvalidUrl from './InvalidUrl'




const MenuContent = ({ children }: { children: React.ReactElement }) => {


  const screens = [
    { name: 'home', component: children, index: 0},
    { name: 'profile', component: children, index: 1},
    { name: 'settings', component: children, index: 2},
    { name: 'logout', component: children, index: 3},
  ]

  const { currentMenu } = AppHelpers()

  const loadContent = (): JSX.Element => {
    const findScreen = screens.find(screen => screen.index === currentMenu)
    if(!findScreen){
      return <InvalidUrl />
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