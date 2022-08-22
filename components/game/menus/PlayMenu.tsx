import IconButton from "@/components/atoms/buttons/IconButton"
import { faCrown, faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AppHelpers } from "context/AppHelpers"
import Image from "next/image"
import React, { MutableRefObject } from "react"

const PlayMenuDialog = ({ children = <></>, buttonText = "Play", onPlay, isLoading }: {
  children?: Array<React.ReactElement> | React.ReactElement,
  buttonText?: string, onPlay: () => void, isLoading: boolean
}) => {
  return (
    <div className="pop-in m-9 justify-between absolute mt-14 p-5 pt-2 flex flex-col rounded-3xl
      w-[450px] h-[400px] left-1/2 ml-[-200px] bg-pop-up smAndDown:w-full smAndDown:m-0 smAndDown:left-0">
      <div className="px-4">
        <div className="font-bold flex items-center justify-center">
          <Image priority={true} src="/logos/xenta.png" width={100} height={100} alt="profile-pic" />
          <h3 className="heading-3">
            Xenta
          </h3>
        </div>
        {children}
      </div>
      <div className="flex pb-5 justify-center">
        <IconButton color="bg-primary"
          text={buttonText} icon={faPlay} onClick={onPlay}
          disabled={isLoading} />
      </div>
    </div>
  )
}
const PlayMenu = ({ score, setScore, isGameFinished, isLoading, setTutorialOverlay }:
  {
    score: number, setScore: (score: number) => void,
    isGameFinished: MutableRefObject<boolean>, isLoading: boolean
    setTutorialOverlay: (showTutorialOverlay: boolean) => void
  }
) => {
  const { gameHelpers } = AppHelpers()
  const hasNoLives = gameHelpers.lives.every(life => !life.isActive)
  const playFirstTime = () => {
    setTutorialOverlay
    setScore(0)
    gameHelpers.resetFields()
    isGameFinished.current = false
  }
  const playAgain = () => {
    setScore(0)
    gameHelpers.resetFields()
    isGameFinished.current = false
  }
  if (hasNoLives) {
    return (
      <PlayMenuDialog isLoading={isLoading} onPlay={playAgain}>
        <div className="font-bold flex pt-3 items-center">
          <h3 className="heading-3">
            You lost!
          </h3>
        </div>
        <div className="flex pt-4 items-center">
          <FontAwesomeIcon className="icon" color="yellow" icon={faCrown} />
          <h3 className="subtitle-1 font-bold pl-2">Score: {score}</h3>
        </div>
      </PlayMenuDialog>
    )
  }
  if (isGameFinished.current) {
    return (
      <PlayMenuDialog onPlay={playFirstTime} isLoading={isLoading}>
        <h3 className="pt-3 heading-3 font-bold">Welcome!</h3>
        <p className="pt-3 subtitle-2">
          Hey! I hope you enjoy this silly game I created while being bored &#129400;
        </p>
      </PlayMenuDialog>
    )
  }
  return <></>
}

export default PlayMenu
