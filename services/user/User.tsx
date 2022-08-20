import { AppHelpers } from 'context/AppHelpers'
import Router from 'next/router'
import { useQuery, UseQueryResult } from 'react-query'
import { ApiService } from 'services/api/ApiService'
const MINUTES = 1
const REFRESH_TOKEN_EVERY = MINUTES * (60 * 1000)
export interface UserData{
  created_at: Date;
  id: number;
  name: string;
  roles: string[];
  score: number;
  updated_at: Date;
  username: string;
}
export interface ChangePasswordParams {
  [index: string]: string
}

export const usePingUser = () => {
  return useQuery(['pingUser'], () => ApiService('GET', '/api/ping'), { refetchInterval: REFRESH_TOKEN_EVERY })
}

export const useGetUser = () => {
  return useQuery(['getUser'], () => ApiService('GET', '/api/user'))
}

export const useLoginUser = (params?: Object) => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['loginUser', params], async() => {
    const response = await ApiService('POST', '/signin', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message || response.error,
          type: response.error ? 'error' : 'success'
        }],
        displayToast: true
      })
      setIsAuthenticated(true)
      Router.push('/')
    }
    return response
  }, { enabled: false })

}

export const useSignInUser = (params: Object) => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['signInUser', params], async() => {
    const response = await ApiService('PUT', '/signup', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message || response.error,
          type: response.error ? 'error' : 'success'
        }],
        displayToast: true
      })
    }
    return response
  }, { enabled: false })
}

export const useLogoutUser = () => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['logoutUser'], async() => {
    const response = await ApiService('LOGOUT')
    setToast({
      messages: [{
        message: response.message || response.error,
        type: response.error ? 'error' : 'success'
      }],
      displayToast: true
    })
    return response
  }, { enabled: false })
}

export const useChangePasswordUser = (params: ChangePasswordParams) => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['changePasswordUser'], async() => {
    const response = await ApiService('POST', '/api/change-password', params)
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message || response.error,
          type: response.error ? 'error' : 'success'
        }],
        displayToast: true
      })
      Router.push('/logout')
    }
    return response
  }, { enabled: false })
}

export const isFirstTimeUser = () => {
  const hasPlayed = localStorage.getItem('xenta-tutorial')
  if (!hasPlayed) {
    localStorage.setItem('xenta-tutorial', 'true')
    return true
  }
  return false
}

export const useUpdateEmailUser = async(email: string) => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['updateEmailUser'], async() => {
    const response = await ApiService('POST', '/api/update-email', { username: email })
    if(response && response.message){
      setToast({
        messages: [{
          message: response.message || response.error,
          type: response.error ? 'error' : 'success'
        }],
        displayToast: true
      })
    }
    return response
  }, { enabled: false })
}

export const useUpdateScoreUser = (score: number) => {
  const { setIsAuthenticated, setToast } = AppHelpers()
  return useQuery(['updateScoreUser'], async() => {
    const response = await ApiService('PUT', '/api/update-score', score)
    setToast({
      messages: [{
        message: response.message || response.error,
        type: response.error ? 'error' : 'success'
      }],
      displayToast: true
    })
    return response
  }, { enabled: false })
} 
