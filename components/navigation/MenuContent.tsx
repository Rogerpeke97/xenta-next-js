import Router from 'next/router'
import react from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Loading from '../atoms/loaders/Loading'
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
    if(Router.pathname === '/login'){
      return <Loading isLoading={true} loadingText="Loading..." />
    }
    return findScreen.component
  }

  return (
    <div className="h-full overflow-y-auto px-5 py-6 bg-no-repeat bg-cover" style={{ backgroundImage: "url('backgrounds/curvedshape.webp')" }}>
      {loadContent()}
    </div>
  )
}

export default MenuContent