import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { AppContextHelpers } from '../context/AppContextHelpers'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import NavigationLayout from '../components/layouts/NavigationLayout'

const Home = () => {

  const { showSideBar, setShowSideBar, api, setToast } = useContext(AppContextHelpers)


  const [userData, setUserData] = useState({
    username: '',
    name: ''
  })


  async function getUserData(){
    const response = await api.get('/user')
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
    setUserData(response.user)
  }

  useEffect(() => {
    getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <h3 className="heading-2">
        Welcome back
       <span className="text-card">{' ' + userData.name}</span>!
       </h3>
       <div style={{height: '1000px'}}>
        GAME GOES HERE 
       </div>
    </div>
  )
}

export default Home
