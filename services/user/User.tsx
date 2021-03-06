import Router from 'next/router';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppHelpers } from '../../context/AppHelpers';
import { ApiServicer } from '../api/ApiService';
const UserServiceContext = createContext<any>({})

const UserServiceWrapper = ({ children }: { children: Array<React.ReactElement> }) => {

  const { setIsAuthenticated, setToast } = AppHelpers()

  const { ApiService } = ApiServicer()

  const [isServiceReady, setIsServiceReady] = useState(false)

  const getUser = () => {
    return ApiService('GET', '/api/user')
  }

  const loginUser = async(params: Object) => {
    const response = await ApiService('POST', '/signin', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message,
          type: 'success'
        }],
        displayToast: true
      })
      setIsAuthenticated(true)
      Router.push('/')
    }
    return response
  }

  const signInUser = async(params: Object) => {
    const response = await ApiService('PUT', '/signup', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message,
          type: 'success'
        }],
        displayToast: true
      })
    }
    return response
  }

  const pingUser = async() => {
    const response = await ApiService('GET', '/api/ping')
    if (response && !response.error) {
      setIsAuthenticated(true)
    }
    else{
      ApiService('LOGOUT')
      return Router.push('/login')
    }
    return response
  }

  const logoutUser = () => {
    const response = ApiService('LOGOUT')
    setToast({
      messages: [{
        message: 'Successfully logged out',
        type: 'success'
      }],
      displayToast: true
    })
    return response
  }

  const changePasswordUser = async(params: Object) => {
    const response = await ApiService('POST', '/api/change-password', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message,
          type: 'success'
        }],
        displayToast: true
      })
      Router.push('/logout')
    }
    return response
  }

  const isFirstTimeUser = () => {
    const hasPlayed = localStorage.getItem('xenta-tutorial')
    if (!hasPlayed) {
      localStorage.setItem('xenta-tutorial', 'true')
      return true
    }
    return false
  }

  const updateEmailUser = async(email: string) => {
    const response = await ApiService('POST', '/api/update-email', { username: email })
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message,
          type: 'success'
        }],
        displayToast: true
      })
    }
    return response
  }

  const updateScoreUser = async(score: number) => {
    const response = await ApiService('PUT', '/api/update-score', score)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message,
          type: 'success'
        }],
        displayToast: true
      })
    }
    return response
  }

  useEffect(() => {
    if (ApiService) {
      setIsServiceReady(true)
    }
  }, [ApiService])

  return (
    <UserServiceContext.Provider value={{
      getUser, loginUser, signInUser, pingUser,
      logoutUser, changePasswordUser, isServiceReady,
      isFirstTimeUser, updateEmailUser, updateScoreUser
    }}>
      {children}
    </UserServiceContext.Provider>
  )
}

export const UserServicer = () => useContext(UserServiceContext)

export default UserServiceWrapper