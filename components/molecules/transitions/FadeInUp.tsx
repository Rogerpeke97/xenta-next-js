import React, { useEffect, useState } from 'react'

const FadeInUp = ({ children, delayMs = 0, className = "" }: { children: React.ReactElement | Array<React.ReactElement>, delayMs?: number, className?: string }) => {

  const [startAnimation, setStartAnimation] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true)
    }, delayMs)
  }, [])

  return (
    <>
      { startAnimation ? <div className={`fade-in-up ${className}`}>{children}</div> : <></> }
    </>
  )
}

export default FadeInUp