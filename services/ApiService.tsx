import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import Api from '../services/Api';
import { AppHelpers } from '../context/AppHelpers';

const ApiServiceContext = createContext<any>({})

const ApiServiceWrapper = ({ children }: { children: Array<React.ReactElement> }) => {

  const { setIsAuthenticated } = AppHelpers()

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
    console.log(apiService)
    if(!apiService) return
    const response = await handler(method, url, params)
    console.log(response)
    if(response?.status === 401){
      console.log('here')
      setIsAuthenticated(false);
      return
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