import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import Api from '../services/Api';
import { AppHelpers } from '../context/AppHelpers';
import Router from 'next/router';

const ApiServiceContext = createContext<any>({})

const ApiServiceWrapper = ({ children }: { children: React.ReactElement }) => {

  const { setIsAuthenticated, setToast } = AppHelpers()

  const [apiService, setApiService] = useState<Api>()

  const handler = (method: string, url?: string, params?: Object) => {
    if(url) {
      if(params){
        if(method === 'POST'){
          return apiService?.post(url, params)
        }
        if(method === 'PUT'){
          return apiService?.put(url, params)
        }
      }
      if(method === 'GET'){
        return apiService?.get(url)
      }
      if(method === 'DELETE'){
        return apiService?._delete(url)
      }
    }
    if(method === 'LOGOUT'){
      return apiService?.logout()
    }
  }

  const ApiService = useCallback(async (method: string, url?: string, params?: Object) => {
    if(!apiService) return
    const response = await handler(method, url, params)
    if(response?.status === 401){
      setIsAuthenticated(false);
      return
    }
    if(response && response.error){
      setToast({
        messages: [{
          message: response.error,
          type: 'error'
        }],
        displayToast: true
      })
    }
    return response
  }, [apiService])
  

  useEffect(() => {
    const apiInit = new Api()
    setApiService(apiInit)
  }, [])


  return(
    <ApiServiceContext.Provider value={{ ApiService }}>
      {children}
    </ApiServiceContext.Provider>
  )
}

export const ApiServicer = () => useContext(ApiServiceContext)

export default ApiServiceWrapper