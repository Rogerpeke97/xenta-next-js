import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useContext, useEffect, useState } from 'react'
import SideBar from '../components/modules/navigation/SideBar'
import MenuContent from '../components/modules/navigation/MenuContent'
import { AppContextHelpers } from '../context/AppContextHelpers'
import NavigationBar from '../components/modules/navigation/NavigationBar'
import NavigationLayout from '../components/layouts/NavigationLayout'
import Overlay from '../components/modules/overlays/Overlay'
import Loading from '../components/atoms/loaders/Loading'
import Menu from '../components/modules/game/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faArrowLeft, faArrowRight, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../components/atoms/links/TextLink'
import IconButton from '../components/atoms/buttons/IconButton'


const styles = {
  keyboardKey: {
    backgroundColor: 'black',
    width: '70px',
    height: '70px',
    color: 'white',
    borderRadius: '5px',
    padding: '5px',
    margin: '5px',
    border: '1px solid white',
    boxShadow: '2px 2px 1px 0px white',
    WebkitBoxShadow: '2px 2px 1px 0px white',
  }
}


const Home = () => {

  const [currentLives, setCurrentLives] = useState(3)

  const [currentKey, setCurrentKey] = useState('')

  const LIVES = 3

  const { showSideBar, setShowSideBar, api, setToast, windowWidth } = useContext(AppContextHelpers)

  const [isLoading, setIsLoading] = useState(true)

  const [showTutorialOverlay, setTutorialOverlay] = useState(false)


  const [userData, setUserData] = useState({
    username: '',
    name: '',
    score: 0,
  })


  const getUserData = useCallback(async () => {
    setIsLoading(true)
    const response = await api.get('/api/user')
    console.log(response)
    if (response.error) {
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
  }, [])

  function checkIfFirstTime() {
    const hasGameStorage = localStorage.getItem('xenta-tutorial')
    if (!hasGameStorage) {
      setTutorialOverlay(true)
      localStorage.setItem('xenta-tutorial', 'false')
    }
  }

  function gameInstructions() {
    const isMobile = windowWidth.description === 'small'
    return (
      <div className="h-96 m-24 flex flex-col items-center justify-center bg-success"
        style={{ opacity: 0.9 }}>
        <h3 className="heading-3">
          Game controls
        </h3>
        <div className={`${isMobile ? '' : 'flex'} items-center mt-6`}>
          <div className="flex items-center p-2">
            <h3 className="subtitle-2">Jump:</h3>
            <div className="pl-2">
              <div style={styles.keyboardKey}>
                <span>Space</span>
              </div>
            </div>
          </div>
          <div className="flex items-center p-2">
            <h3 className="subtitle-2">Move left:</h3>
            <div className="pl-2">
              <div style={styles.keyboardKey}>
                <FontAwesomeIcon className="icon" icon={faArrowLeft} />
              </div>
            </div>
          </div>
          <div className="flex items-center p-2">
            <h3 className="subtitle-2">Move right:</h3>
            <div className="pl-2">
              <div style={styles.keyboardKey}>
                <FontAwesomeIcon className="icon" icon={faArrowRight} />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex w-full justify-end">
            <TextLink textColor="gray" text="Hide" onClick={() => setTutorialOverlay(false)} />
          </div>
        </div>
      </div>
    )
  }


  useEffect(() => {
    checkIfFirstTime()
    getUserData()
  }, [getUserData])

  return (
    <div>
      {!isLoading ?
        <Menu />                  :
        <div className="smooth-render relative">
          <div className="h-16 flex justify-between">
            <h3 className="heading-2">
              Welcome back
              <span className="text-card">{' ' + userData.name}</span>!
            </h3>
            <IconButton iconName={faQuestionCircle} onClick={() => setTutorialOverlay(!showTutorialOverlay)} iconSize={'iconRegular'} />
          </div>
          <Menu />
          <div className="absolute top-16 h-full w-full">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="flex">
                  {Array(LIVES).fill(0).map((_, index) => {
                    return (
                      <FontAwesomeIcon className="icon-large pr-3" color="red" key={index} icon={faHeart} />
                    )
                  })}
                </div>
                <h3 className="subtitle-2">x{LIVES}</h3>
              </div>
              <div>
                <h3 className="heading-3">
                  Score:
                  <span className="text-card">{' ' + userData.score}</span>
                </h3>
              </div>
            </div>
            {showTutorialOverlay && gameInstructions()}
          </div>
        </div>
      }
    </div>
  )
}

export default Home
