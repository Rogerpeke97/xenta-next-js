import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { AppContextHelpers } from '../context/AppContextHelpers'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import NavigationLayout from '../components/layouts/NavigationLayout'
import Overlay from '../components/modules/overlays/Overlay'
import Loading from '../components/atoms/loaders/Loading'
import Menu from '../components/modules/game/Menu'

const Home = () => {

  const { showSideBar, setShowSideBar, api, setToast } = useContext(AppContextHelpers)

  const [isLoading, setIsLoading] = useState(true)


  const [userData, setUserData] = useState({
    username: '',
    name: ''
  })


  async function getUserData(){
    setIsLoading(true)
    const response = await api.get('/api/user')
    console.log(response)
    if(response.error){
      setToast({
        messages: [{
          message: response.error,
          type: 'error'
        }],
        displayToast: true
      })
    }
    setUserData(response.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {isLoading ? 
        <Loading isLoading={isLoading} loadingText="Loading your profile..." /> :
        <div className="smooth-render">
          <h3 className="heading-2">
            Welcome back
          <span className="text-card">{' ' + userData.name}</span>!
          </h3>
          <div>
            <Menu />
          </div>
        </div>
      }
    </div>
  )
}

export default Home
