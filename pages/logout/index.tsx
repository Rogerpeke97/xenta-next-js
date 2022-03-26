import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import Loading from "../../components/atoms/loaders/Loading"
import { ApiServicer } from '../../context/ApiService'
import { AppHelpers } from '../../context/AppHelpers'



const Logout = () => {

  const [isLoading, setIsLoading] = useState(true)

  const { ApiService } = ApiServicer()
  
  const router = useRouter()

  function removeTokenAndLogout() {
    ApiService('LOGOUT')
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