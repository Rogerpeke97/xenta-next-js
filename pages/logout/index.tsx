import { AppHelpers } from 'context/AppHelpers'
import { useRouter } from 'next/router'
import { useEffect } from "react"
import { useLogoutUser } from 'services/user/User'
import Loading from "../../components/atoms/loaders/Loading"

const Logout = () => {
  const { setIsAuthenticated } = AppHelpers()
  const { isLoading, refetch } = useLogoutUser()
  const router = useRouter()
  const removeTokenAndLogout = async() => {
    await refetch()
    router.push('/login')
  }
  useEffect(() => {
    removeTokenAndLogout()
    return () => {
      setIsAuthenticated(false)
    }
  }, [])

  return (
    <Loading isLoading={isLoading} loadingText="Logging out..." />
  )
}


export default Logout
