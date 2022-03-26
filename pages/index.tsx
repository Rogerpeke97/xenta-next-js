import { useCallback, useEffect, useRef, useState } from 'react'
import { AppHelpers } from '../context/AppHelpers'
import Menu from '../components/game/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faArrowLeft, faArrowRight, faPlay, faCrown, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import TextLink from '../components/atoms/links/TextLink'
import IconButton from '../components/atoms/buttons/IconButton'
import Button from '../components/atoms/buttons/Button'
import Image from 'next/image'
import { ApiServicer } from '../context/ApiService'

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

  const { gameHelpers, setToast } = AppHelpers()

  const { ApiService } = ApiServicer()

  const [isLoading, setIsLoading] = useState(true)

  const [score, setScore] = useState(0)

  const intervalForScoreSum = useRef<NodeJS.Timeout>()

  const [showTutorialOverlay, setTutorialOverlay] = useState(false)

  const isGameFinished = useRef(true)

  const [firstTime, setFirstTime] = useState(true)

  const [userData, setUserData] = useState({
    username: '',
    name: '',
    score: 0,
  })


  async function getUserData(){
    setIsLoading(true)
    const response = await ApiService('GET', '/api/user')
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
  }

  function checkIfFirstTime() {
    const hasGameStorage = localStorage.getItem('xenta-tutorial')
    if (!hasGameStorage) {
      setTutorialOverlay(true)
      localStorage.setItem('xenta-tutorial', 'false')
    }
  }

  function gameInstructions() {
    return (
      <div className="smooth-render h-96 m-24 opacity-90 flex flex-col items-center justify-center bg-success">
        <h3 className="heading-3 font-bold">
          Game controls
        </h3>
        <div className="mdAndUp:flex items-center mt-6">
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


  const isActiveHeart = useCallback((heartIndex: number) => {
    const isActive = gameHelpers.lives.find((_, index) => index === heartIndex)?.isActive
    return isActive ? faHeart : faHeartBroken
  }, [gameHelpers.lives])

  const setIntervalForScoreSum = useCallback(() => {
    intervalForScoreSum.current = setInterval(() => {
      if (isGameFinished.current) return
      setScore(score + 1)
    }, 250)
  }, [score])


  useEffect(() => {
    checkIfFirstTime()
    getUserData()
    setIntervalForScoreSum()
    return () => {
      if (!intervalForScoreSum.current) return
      clearInterval(intervalForScoreSum.current)
    }
  }, [gameHelpers, setIntervalForScoreSum])


  const gameOverOverlay = useCallback(() => {
    const hasNoLives = gameHelpers.lives.every(life => !life.isActive)
    if (!hasNoLives && !firstTime) return
    if (firstTime) {
      return (
        <div className="pop-in m-9 absolute mt-14 p-5 flex flex-col bg-pop-up rounded-lg"
          style={{ height: '280px', width: '300px', left: '50%', marginLeft: '-150px' }}>
          <div className="font-bold flex items-center justify-center">
            <Image priority={true} src="/logos/xenta.png" width={100} height={100} alt="profile-pic" />
            <h3 className="heading-3">
              Xenta
            </h3>
          </div>
          <div className="flex py-16 items-center justify-center">
            <Button size="regular" color="bg-primary"
              text="Play" icon={faPlay} onClick={() => {
                setFirstTime(false)
                setScore(0)
                gameHelpers.resetFields()
                isGameFinished.current = false
              }}
              disabled={isLoading} />
          </div>
        </div>
      )
    }
    return (
      <div className="pop-in m-9 absolute bg-pop-up mt-14 p-9 flex flex-col rounded-lg"
        style={{ height: '400px', width: '300px', left: '50%', marginLeft: '-150px' }}>
        <div className="font-bold flex items-center justify-center">
          <Image src="/logos/xenta.png" width={100} height={100} alt="profile-pic" />
          <h3 className="heading-3">
            Xenta
          </h3>
        </div>
        <div className="font-bold flex pt-10 items-center">
          <h3 className="subtitle-1">
            You lost!
          </h3>
        </div>
        <div className="flex pt-3 items-center">
          <FontAwesomeIcon className="icon" color="yellow" icon={faCrown} />
          <h3 className="subtitle-1 font-bold pl-2">Score: {score}</h3>
        </div>
        <div className="flex pt-12 items-center justify-center">
          <Button size="regular" color="bg-primary"
            text="Play again" icon={faPlay} onClick={() => {
              setScore(0)
              gameHelpers.resetFields()
              isGameFinished.current = false
            }}
            disabled={isLoading} />
        </div>
      </div>
    )
  }, [gameHelpers, isLoading, firstTime, score])


  return (
    <div>
      <div className="smooth-render relative">
        <div className="h-16 flex items-center justify-between">
          <h3 className="subtitle-1 font-bold" onClick={() => gameHelpers.resetFields()}>
            Welcome back
            <span className="text-card">{' ' + userData.name}</span>!
          </h3>
          <IconButton iconName={faKeyboard} onClick={() => setTutorialOverlay(!showTutorialOverlay)} iconSize={'icon'} />
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
              <h3 className="subtitle-2 font-bold">x{gameHelpers.lives.filter(heart => heart.isActive).length}</h3>
            </div>
            <div>
              <h3 className="font-bold subtitle-1">
                Score:
                <span className="text-card">{" " + score}</span>
              </h3>
            </div>
          </div>
          {showTutorialOverlay ? gameInstructions() : gameOverOverlay()}
        </div>
      </div>
    </div>
  )
}

export default Home
