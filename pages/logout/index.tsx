import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import Loading from "../../components/atoms/loaders/Loading"
import { UserServicer } from '../../services/user/User'



const Logout = () => {

  const [isLoading, setIsLoading] = useState(true)

  const { logoutUser } = UserServicer()
  
  const router = useRouter()

  function removeTokenAndLogout() {
    logoutUser()
    router.replace('/login')
    setIsLoading(false)
  }

  useEffect(() => {
    removeTokenAndLogout()
    return () => {
      removeTokenAndLogout()
    }
  }, [])



  return (
    <Loading isLoading={isLoading} loadingText="Logging out..." />
  )
}


export default Logout