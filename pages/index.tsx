import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { NavigationMenuState } from '../context/NavigationMenuState'

const Home: NextPage = () => {

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState({description: '', size: 0})

  const [showSideBar, setShowSideBar] = useState(false)


  function main() {
    setWindowWidth({description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth})
    window.addEventListener('resize', () => {
      setWindowWidth(() => {
        const windowSize = {
          description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth
        }
        if (windowSize.description === 'big') {
          setShowSideBar(false)
        }
        return windowSize
      })
    })
  }

  useEffect(() => {
    main()
  }, [])


  return (
    <div>
      <NavigationMenuState.Provider value={{ currentMenu, setCurrentMenu, windowWidth, showSideBar, setShowSideBar }}>
        <div className="h-screen flex">
          <SideBar name={"Logo"} />
          <div className="flex flex-col grow">
            <NavigationBar name={"Xenta Web"} sideBar={[showSideBar, setShowSideBar]} />
            {/* <MenuContent /> */}
          </div>
        </div>
      </NavigationMenuState.Provider>
    </div>
  )
}

export default Home
