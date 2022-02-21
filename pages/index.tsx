import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AppContextHelpers } from '../context/AppContextHelpers'
import Menu from '../components/game/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faArrowLeft, faArrowRight, faQuestionCircle, faPlay, faDizzy, faCrown } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../components/atoms/links/TextLink'
import IconButton from '../components/atoms/buttons/IconButton'
import Button from '../components/atoms/buttons/Button'


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


  const LIVES = 3

  const { api, gameHelpers, setToast, windowWidth } = useContext(AppContextHelpers)

  const [isLoading, setIsLoading] = useState(true)

  const [showTutorialOverlay, setTutorialOverlay] = useState(false)

  const isGameFinished = useRef(false)

  const [userData, setUserData] = useState({
    username: '',
    name: '',
    score: 0,
  })


  const getUserData = useCallback(async () => {
    setIsLoading(true)
    const response = await api.get('/api/user')
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


  function isActiveHeart(heartIndex: number) {
    const isActive = gameHelpers.lives.find((_, index) => index === heartIndex)?.isActive
    return isActive ? faHeart : faHeartBroken
  }


  useEffect(() => {
    console.log('rendering index')
    console.log(gameHelpers.gameInterval)
    checkIfFirstTime()
    getUserData()
  }, [getUserData, gameHelpers])


  const gameOverOverlay = useCallback(() => {
    if (!gameHelpers.lives.every(life => !life.isActive)) return null
    return (
      <div className="pop-in m-9 absolute bg-background mt-14 p-9 flex flex-col bg-success rounded-lg"
        style={{ height: '300px', width: '300px', left: '50%', marginLeft: '-150px' }}>
          <div className="flex items-center justify-center">
            <FontAwesomeIcon className="icon" color="red" icon={faDizzy} />
            <h3 className="pl-4 md:heading-3 sm:subtitle-1 font-bold underline">
            You lost!
            </h3>
          </div>
        <div>
          <div className="flex pt-14 items-center">
            <FontAwesomeIcon className="icon" color="yellow" icon={faCrown} />
            <h3 className="md:subtitle-1 sm:subtitle-3 font-bold pl-4">Score:</h3>
          </div>
          <div className="flex pt-14 items-center justify-center">
            <Button size="regular" color="bg-primary"
              text="Play again" icon={faPlay} onClick={() => {
                gameHelpers.resetFields()
                isGameFinished.current = false
              }}
              disabled={isLoading} />
          </div>
        </div>
      </div>
    )
  }, [gameHelpers, isLoading])


  return (
    <div>
      <div className="smooth-render relative">
        <div className="h-16 flex items-center justify-between">
          <h3 className="md:heading-3 sm:subtitle-1" onClick={() => gameHelpers.resetFields() }>
            Welcome back
            <span className="text-card">{' ' + userData.name}</span>!
          </h3>
          <IconButton iconName={faQuestionCircle} onClick={() => setTutorialOverlay(!showTutorialOverlay)} iconSize={'iconRegular'} />
        </div>
        <Menu isGameFinished={isGameFinished} />
        <div className="absolute top-16 h-screen w-full">
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex">
                {Array(LIVES).fill(0).map((_, index) => {
                  return (
                    <FontAwesomeIcon className="icon-large pr-3" color={gameHelpers.lives[index].isActive ? 'red' : 'white'} key={index} icon={isActiveHeart(index)} />
                  )
                })}
              </div>
              <h3 className="subtitle-2">x{gameHelpers.lives.filter(heart => heart.isActive).length}</h3>
            </div>
            <div>
              <h3 className="md:heading-3 sm:subtitle-1">
                Score:
                <span className="text-card">{' ' + userData.score}</span>
              </h3>
            </div>
          </div>
          {showTutorialOverlay && gameInstructions()}
          {gameOverOverlay()}
        </div>
      </div>
    </div>
  )
}

export default Home
