import type react from 'react'
import { useEffect, useState } from 'react'
import Overlay from '../../overlays/Overlay'




const Home = () => {
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = 'John Doe'
  const loadData = () => {
    setIsLoading(true)
    // setTimeout(() => {
    //   setIsLoading(false)
    // }, 2000)
  }
  useEffect(() => {
    loadData()
  }, [isLoading])
  return(
    <div className="smooth-render flex relative h-full">
      <Overlay isLoading={isLoading}/>
      <div>
        <h1 className="pl-1 heading-3 font-bold">
            Welcome back {currentUser}!
        </h1>
      </div>
    </div>
  )
}


export default Home






