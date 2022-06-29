import { useCallback, useEffect, useRef, useState } from 'react'
import { AppHelpers } from '../context/AppHelpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken, faKeyboard } from '@fortawesome/free-solid-svg-icons'
import IconButton from '../components/atoms/buttons/IconButton'
import InstructionsMenu from '@/components/game/menus/InstructionsMenu'
import PlayMenu from '@/components/game/menus/PlayMenu'
import { isFirstTimeUser, useGetUser, useUpdateScoreUser } from 'services/user/User'
import Game from '../components/game/scenes/Game'

const Home = () => {

  const LIVES = 3
  const { gameHelpers } = AppHelpers()
  const [score, setScore] = useState(0)
  const intervalForScoreSum = useRef<NodeJS.Timeout>()
  const [showTutorialOverlay, setTutorialOverlay] = useState(false)
  const [isMaxScoreSet, setIsMaxScoreSet] = useState(false)
  const isGameFinished = useRef(true)
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    score: 0,
  })
  const { isLoading, data: fetchedUserData, refetch } = useGetUser()
  useEffect(() => {
    if(!fetchedUserData) {
      refetch()
    }
    if(fetchedUserData){
      setUserData(userData)
    }
  }, [fetchedUserData, userData, refetch])
  const updateScore = async() => {
    if(score <= userData.score || isMaxScoreSet) return
    await useUpdateScoreUser(score)
    setIsMaxScoreSet(true)
  }
  const isActiveHeart = (heartIndex: number) => {
    const isActive = gameHelpers.lives.find((_, index) => index === heartIndex)?.isActive
    return isActive
  }
  const setIntervalForScoreSum = useCallback(() => {
    intervalForScoreSum.current = setInterval(async() => {
      if (isGameFinished.current) {
        await updateScore()
        return
      }
      setScore(score + 1)
    }, 250)
  }, [score, isMaxScoreSet])
  const livesRemaining = () => {
    return gameHelpers.lives.filter(heart => heart.isActive).length
  }
  useEffect(() => {
    setIntervalForScoreSum()
    return () => {
      if (!intervalForScoreSum.current) return
      clearInterval(intervalForScoreSum.current)
    }
  }, [gameHelpers, setIntervalForScoreSum])
  useEffect(() => {
    setTutorialOverlay(isFirstTimeUser())
    return () => {
      gameHelpers.resetFields()
    }
  }, [])

  return (
    <div className="smooth-render relative h-full">
      <Game isGameFinished={isGameFinished} />
      <div className="absolute flex flex-col justify-between inset-0 p-4 h-full w-full">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex">
              {Array(LIVES).fill(0).map((_, index) => {
                return (
                  <FontAwesomeIcon className="icon-large pr-3" color={isActiveHeart(index) ? 'red' : 'white'}
                    key={index}
                    icon={isActiveHeart(index) ? faHeart : faHeartBroken} />
                )
              })}
            </div>
            <h3 className="subtitle-2 font-bold">x{livesRemaining()}</h3>
          </div>
          <div>
            <h3 className="font-bold subtitle-1">
              Score:
              <span className="text-card">{" " + score}</span>
            </h3>
          </div>
        </div>
        {showTutorialOverlay ? 
          <InstructionsMenu setTutorialOverlay={setTutorialOverlay} /> : 
          <PlayMenu score={score} setScore={setScore} isGameFinished={isGameFinished}
            setIsMaxScoreSet={setIsMaxScoreSet} isLoading={true} setTutorialOverlay={setTutorialOverlay}
          />
        }
        <IconButton iconName={faKeyboard} onClick={() => setTutorialOverlay(!showTutorialOverlay)} iconSize={'icon'} />
      </div>
    </div>
  )
}

export default Home
