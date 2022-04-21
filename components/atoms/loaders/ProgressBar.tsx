import { useEffect, useRef, useState } from "react"

const ProgressBar = ({ progress, totalProgress, titleForAmountLeftFor, className, measurementUnit }: {progress: number, totalProgress: number,
  titleForAmountLeftFor: string, className: string, measurementUnit: string}) => {

  const progressBarContainer = useRef<HTMLDivElement>(null)

  const progressBar = useRef<HTMLDivElement>(null)

  const timeoutRefForWidth = useRef<NodeJS.Timeout>(0)

  const [progressPercentage, setProgressPercentage] = useState(0)

  const currentProgressPercentage = (progress / totalProgress) * 100

  const calculateBarWidth = () => {
    const container = progressBarContainer.current
    if(container){
      const containerWidth = container.clientWidth
      const barWidth = currentProgressPercentage * containerWidth / 100
      return Math.floor(barWidth)
    }
  }

  const amountToTotal = () => {
    return totalProgress - progress
  }

  const setUpProgressAnimation = () => {
    const progressBarDiv = progressBar.current
    if(progressBarDiv){
      const progressBarWidth = parseInt(progressBarDiv.style.width.replace('px', '') || '0')
      if(progressBarWidth === calculateBarWidth()) return
      progressBarDiv.style.width = `${progressBarWidth + 1}px`
      timeoutRefForWidth.current = setTimeout(setUpProgressAnimation, 10)
    }
  }

  useEffect(() => {
    setUpProgressAnimation()
    const intervalForPercentageSum = setInterval(() => {
      if(progressPercentage < currentProgressPercentage){
        setProgressPercentage(progressPercentage + 1)
        return
      }
      clearInterval(intervalForPercentageSum)
    }, 80)
    return () => {
      clearTimeout(timeoutRefForWidth.current)
      clearInterval(intervalForPercentageSum)
    }
  }, [progressPercentage])

  return(
    <>
      <div ref={progressBarContainer} className={`${className} transition ease-out duration-300 h-2 w-full bg-background my-3 rounded-lg`}>
        <div ref={progressBar} className="w-0 h-full bg-stone-300 rounded-lg" />
      </div>
      <div className="flex justify-between w-full">
        <h3 className="body-2 truncate">{`${amountToTotal()} ${measurementUnit} to get to ${titleForAmountLeftFor}`}</h3>
        <h3 className="body-2 ml-5">{`${progressPercentage}%`}</h3>
      </div>
    </>
  )
} 

export default ProgressBar