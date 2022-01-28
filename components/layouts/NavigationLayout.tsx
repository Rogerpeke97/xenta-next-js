import { useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../context/AppContextHelpers'
import MenuContent from '../modules/navigation/MenuContent'
import NavigationBar from '../modules/navigation/NavigationBar'
import SideBar from '../modules/navigation/SideBar'

const NavigationLayout = ({ children }: { children: React.ReactElement }) => {

  const { showSideBar, setShowSideBar, isAuthenticated } = useContext(AppContextHelpers)


  return (
      <div>
          <div className="h-screen flex w-screen">
            <SideBar name={"Logo"} />
            <div className="flex flex-col grow max-w-screen" style={{minWidth: '70vw'}}>
              <NavigationBar name={"Xenta Web"} sideBar={[showSideBar, setShowSideBar]} />
              <MenuContent>
                {children}
              </MenuContent>
            </div>
          </div>
      </div>
  )
}

export default NavigationLayout
