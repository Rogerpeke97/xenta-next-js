import Router from "next/router"
import { useEffect, useState } from "react"
import Loading from "../../components/atoms/loaders/Loading"



const Logout = () => {

  const [isLoading, setIsLoading] = useState(true)

  function removeTokenAndLogout() {
    localStorage.removeItem('token')
    Router.push('/login')
    setIsLoading(false)
  }




  useEffect(() => {
    removeTokenAndLogout()
    return () => {
      setIsLoading(false)
    }
  }, [])



  return (
    <Loading isLoading={isLoading} loadingText="Logging out..." />
  )
}


export default Logout