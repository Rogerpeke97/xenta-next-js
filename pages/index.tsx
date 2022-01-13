import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { NavigationMenuState } from '../context/NavigationMenuState'
import Api from './api/Api'
import { useRouter } from 'next/router'

const Home: NextPage = () => {

  const router = useRouter()

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState({ description: '', size: 0 })

  const [showSideBar, setShowSideBar] = useState(false)

  const [isNotAuthenticated, setIsNotAuthenticated] = useState(true)

  const api = new Api()

  const isUserLoggedIn = async () => {
    try{
      const response = await api.get('/ping')
      console.log(response.error)
      if (!response.ok) {
        router.push('login')
      }
      else{
        setIsNotAuthenticated(false)
      }
    }
    catch{
      router.push('login')
    }
  }


  function main() {
    setWindowWidth({ description: window.innerWidth < 1100 ? "small" : "big", size: window.innerWidth })
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
    isUserLoggedIn()
  }

  useEffect(() => {
    main()
    return () => {
      window.removeEventListener('resize', () => { })
    }
  }, [])


  return (

    isNotAuthenticated ? <div></div> :
      <div>
        <NavigationMenuState.Provider value={{ currentMenu, setCurrentMenu, windowWidth, showSideBar, setShowSideBar, api }}>
          <div className="h-screen flex">
            <SideBar name={"Logo"} />
            <div className="flex flex-col grow">
              <NavigationBar name={"Xenta Web"} sideBar={[showSideBar, setShowSideBar]} />
              <MenuContent />
            </div>
          </div>
        </NavigationMenuState.Provider>
      </div>
  )
}

export default Home
