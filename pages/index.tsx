import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import DefaultLayout from '../components/layouts/DefaultLayout'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { NavigationMenuState } from '../context/NavigationMenuState'

const Home: NextPage = () => {

  const [currentMenu, setCurrentMenu] = useState<any>(null)

  return (
    <div>
      <Head>
        <title>Xenta Web</title>
        <meta name="description" content="Xenta the game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationMenuState.Provider value={{currentMenu, setCurrentMenu}}>
        <DefaultLayout>
          <div className="h-screen flex">
            <SideBar name={"Logo"} />
            <div className="grow">
              <NavigationBar name={"Xenta Web"} />
              <MenuContent />
            </div>
          </div>
        </DefaultLayout>
      </NavigationMenuState.Provider>
    </div>
  )
}

export default Home
