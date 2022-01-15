import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { AppContextHelpers } from '../context/AppContextHelpers'

const Home: NextPage = () => {

  const { showSideBar, setShowSideBar, isAuthenticated } = useContext(AppContextHelpers)

  return (
    !isAuthenticated ? <div></div> :
      <div>
          <div className="h-screen flex">
            <SideBar name={"Logo"} />
            <div className="flex flex-col grow">
              <NavigationBar name={"Xenta Web"} sideBar={[showSideBar, setShowSideBar]} />
              <MenuContent />
            </div>
          </div>
      </div>
  )
}

export default Home
