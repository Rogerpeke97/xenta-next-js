import { useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../context/AppContextHelpers'
import MenuContent from '../modules/navigation/MenuContent'
import NavigationBar from '../modules/navigation/NavigationBar'
import SideBar from '../modules/navigation/SideBar'

const NavigationLayout = ({ children }: { children: React.ReactElement }) => {

  const { showSideBar, setShowSideBar, isAuthenticated } = useContext(AppContextHelpers)


  return (
      <div>
          <div className="h-screen flex">
            <SideBar name={"Logo"} />
            <div className="flex flex-col grow">
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
