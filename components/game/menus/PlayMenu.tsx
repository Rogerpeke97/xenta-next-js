import Button from "@/components/atoms/buttons/Button"
import { faCrown, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AppHelpers } from "context/AppHelpers"
import Image from "next/image"
import { MutableRefObject } from "react"

const PlayMenu = ({ score, setScore, isGameFinished, setIsMaxScoreSet, 
    isLoading, setTutorialOverlay }: 
    { score: number, setScore: (score: number) => void, isGameFinished: MutableRefObject<boolean>
      setIsMaxScoreSet: (isMaxScoreSet: boolean) => void, isLoading: boolean
      setTutorialOverlay: (showTutorialOverlay: boolean) => void
    }
  ) => {
  const { gameHelpers } = AppHelpers()
  const hasNoLives = gameHelpers.lives.every(life => !life.isActive)
  if (hasNoLives) {
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
              setIsMaxScoreSet(false)
            }}
            disabled={isLoading} />
        </div>
      </div>
    )
  }
  if (isGameFinished.current) {
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
              setTutorialOverlay
              setScore(0)
              gameHelpers.resetFields()
              isGameFinished.current = false
            }}
            disabled={isLoading} />
        </div>
      </div>
    )
  }
  return <></>
}

export default PlayMenu
