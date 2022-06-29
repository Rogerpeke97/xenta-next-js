import Router from 'next/router'
import react, { useCallback, useMemo } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Loading from '../atoms/loaders/Loading'
import InvalidUrl from './InvalidUrl'

const MenuContent = ({ children }: { children: React.ReactElement }) => {
  
  const { currentMenu } = AppHelpers()
  const screens = useMemo(() => [
    { name: 'home', component: children, index: 0 },
    { name: 'profile', component: children, index: 1 },
    { name: 'settings', component: children, index: 2 },
    { name: 'logout', component: children, index: 3 },
  ], [children])
  const loadContent = (): JSX.Element => {
    const findScreen = screens.find(screen => screen.index === currentMenu)
    if (!findScreen) {
      return <InvalidUrl />
    }
    return findScreen.component
  }

  return (
    <div className="h-full overflow-y-auto px-5 py-6 bg-background-3">
      {loadContent()}
    </div>
  )
}

export default MenuContent
