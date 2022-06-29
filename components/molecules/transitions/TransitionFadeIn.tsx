import React, { useEffect, useState, useRef, CSSProperties } from 'react'

const TransitionFadeIn = ({ children, delayMs = 0, className = "",
   direction = "up", disableOnScrollDisplay = true, style={} }: 
  { children: React.ReactElement | Array<React.ReactElement>, delayMs?: number, 
    className?: string, direction?: string, disableOnScrollDisplay?: boolean, style?: CSSProperties 
  }) => {

  const [loadedOnce, setLoadedOnce] = useState(false)

  const transitionContainer = useRef<HTMLDivElement>(null)

  const [startAnimation, setStartAnimation] = useState(false)

  const checkForAnimationStart = (e?: Event) => {
    if(!transitionContainer.current) return
    const transitionContainerPosition = transitionContainer.current.getBoundingClientRect()
    const THRESHOLD_TO_DISPLAY = 400
    if((transitionContainerPosition.y < THRESHOLD_TO_DISPLAY && !loadedOnce) || !e) {
      setTimeout(() => {
        setStartAnimation(true)
        setLoadedOnce(true)
      }, delayMs)
    }
  }
  const transitionAxis = () => {
    if(direction === 'up') {
      return 'fade-in-up'
    }
    if(direction === 'down') {
      return 'fade-in-down'
    }
    if(direction === 'left') {
      return 'fade-in-left'
    }
    if(direction === 'right') {
      return 'fade-in-right'
    }
  }
  useEffect(() => {
    if(disableOnScrollDisplay) {
      checkForAnimationStart()
      return
    }
    document.addEventListener('scroll', checkForAnimationStart)
    return () => {
      if(!disableOnScrollDisplay){
        document.removeEventListener('scroll', checkForAnimationStart)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={style} ref={transitionContainer} className={`${startAnimation ? transitionAxis() : 'invisible'} ${className}`}>
      {children}
    </div>
  )
}

export default TransitionFadeIn
