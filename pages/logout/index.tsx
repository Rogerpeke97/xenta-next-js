import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import Loading from "../../components/atoms/loaders/Loading"
import { AppHelpers } from '../../context/AppHelpers'



const Logout = () => {

  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()

  function removeTokenAndLogout() {
    localStorage.removeItem('token')
    router.push('/login')
    setIsLoading(false)
  }

  useEffect(() => {
    removeTokenAndLogout()
  }, [])



  return (
    <Loading isLoading={isLoading} loadingText="Logging out..." />
  )
}


export default Logout