import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppHelpers } from '../../context/AppHelpers';
import { ApiServicer } from '../ApiService';
const UserServiceContext = createContext<any>({})

const UserServiceWrapper = ({ children }: { children: Array<React.ReactElement> }) => {

  const { setIsAuthenticated } = AppHelpers()

  const { ApiService } = ApiServicer()

  const [isServiceReady, setIsServiceReady] = useState(false)

  const getUser = () => {
    return ApiService('GET', '/api/user')
  }

  const loginUser = (params: Object) => {
    return ApiService('POST', '/signin', params)
  }

  const signInUser = (params: Object) => {
    return ApiService('POST', '/signup', params)
  }

  const pingUser = () => {
    return ApiService('GET', '/api/ping')
  }

  const logoutUser = () => {
    return ApiService('LOGOUT')
  }

  const changePasswordUser = (params: Object) => {
    return ApiService('PUT', '/api/change-password', params)
  }

  useEffect(() => {
    if (ApiService) {
      setIsServiceReady(true)
    }
  }, [ApiService])

  return (
    <UserServiceContext.Provider value={{
      getUser, loginUser, signInUser, pingUser,
      logoutUser, changePasswordUser, isServiceReady
    }}>
      {children}
    </UserServiceContext.Provider>
  )
}

export const UserServicer = () => useContext(UserServiceContext)

export default UserServiceWrapper