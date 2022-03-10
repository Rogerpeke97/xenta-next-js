import { useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../context/AppContextHelpers'
import MenuContent from '../navigation/MenuContent'
import NavigationBar from '../navigation/NavigationBar'
import SideBar from '../navigation/SideBar'

const NavigationLayout = ({ children }: { children: React.ReactElement }) => {

  const { showSideBar, setShowSideBar, isAuthenticated } = useContext(AppContextHelpers)


  return (
      <div>
          <div className="h-screen flex w-screen">
            <SideBar />
            <div className="flex flex-col grow max-w-screen" style={{minWidth: '70vw'}}>
              <NavigationBar sideBar={[showSideBar, setShowSideBar]} />
              <MenuContent>
                {children}
              </MenuContent>
            </div>
          </div>
      </div>
  )
}

export default NavigationLayout
