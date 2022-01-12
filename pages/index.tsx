import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { NavigationMenuState } from '../context/NavigationMenuState'

const Home: NextPage = () => {

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState("")


  function main() {
    setWindowWidth(window.innerWidth < 1100 ? "small" : "big")
    window.addEventListener('resize', () => {
      setWindowWidth(() => {
        return window.innerWidth < 1100 ? "small" : "big"
      })
    })
  }

  useEffect(() => {
    main()
  }, [])


  return (
    <div>
      <NavigationMenuState.Provider value={{ currentMenu, setCurrentMenu, windowWidth }}>
        <div className="h-screen flex">
          <SideBar name={"Logo"} />
          <div className="flex flex-col grow">
            <NavigationBar name={"Xenta Web"} />
            <MenuContent />
          </div>
        </div>
      </NavigationMenuState.Provider>
    </div>
  )
}

export default Home
