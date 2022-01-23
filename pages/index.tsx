import type { NextPage } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { AppContextHelpers } from '../context/AppContextHelpers'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import NavigationLayout from '../components/layouts/NavigationLayout'

const Home = () => {

  const { showSideBar, setShowSideBar, isAuthenticated } = useContext(AppContextHelpers)

  return (
    <div className="flex">HOME</div>
  )
}

export default Home
