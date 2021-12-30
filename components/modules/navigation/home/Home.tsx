import type react from 'react'
import { useEffect, useState } from 'react'
import Overlay from '../../overlays/Overlay'




const Home = () => {
  const title = 'Xenta'.split('')
  const [isLoading, setIsLoading] = useState(false)
  const loadData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }
  useEffect(() => {
    loadData()
  }, [])
  return(
    <div className="smooth-render flex relative h-full">
      <Overlay isLoading={isLoading}/>
      <div>
        {title.map((letter, index) => {
          return <h1 key={index} style={{ '--i': index, fontSize: '50px' }} 
          className="animate-text pl-1 heading-1 underline font-bold"
          >
            {letter}
          </h1>
        })}
      </div>
    </div>
  )
}


export default Home






