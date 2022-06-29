import {createContext, useCallback, useContext, useEffect, useState, useRef, memo} from 'react';
import { AppHelpers } from '../../context/AppHelpers';
import Router from 'next/router';

const ApiServiceContext = createContext<any>({})
const CANT_CONNECT_TO_SERVER_ERR = {
  error: 'Can\'t connect to the server',
  ok: false,
  message: ''
}

interface ApiReturnValues {
  error: String | Boolean,
  ok: Boolean,
  message: String,
}

const ApiServiceWrapper = ({ children }: { children: Array<React.ReactElement> }) => {

  const { setIsAuthenticated, setToast } = AppHelpers()
  const headers = useRef<Headers>(new Headers())
  const url = useRef<String>('http://localhost:8080')
  headers.current.set('Content-Type', 'application/json')
  headers.current.set('Accept', 'application/json')
  if(typeof window !== 'undefined'){
    headers.current.set('Authorization', localStorage.getItem('token') ?? '')
  }
  
  const get = async(urlPath: string): Promise<ApiReturnValues> => {
    const requestOptions = {
      method: 'GET',
      headers: headers.current
    };
    try {
      const response = await fetch(url.current + urlPath, requestOptions);
      const authHeader = response.headers.get('Authorization') ?? '';
      if(authHeader?.length > 0){
        headers.current.set('Authorization', authHeader);
      }
      return handleResponse(response);
    }
    catch (error: any) {
      if(error?.error){
        return error
      }
      return CANT_CONNECT_TO_SERVER_ERR;
    }
  }

  const post = async(urlPath: string, body: Object): Promise<ApiReturnValues> => {
    const requestOptions = {
      method: 'POST',
      headers: headers.current,
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(url.current + urlPath, requestOptions);
      return handleResponse(response);
    }
    catch (error: any) {
      if(error?.error){
        return error
      }
      return CANT_CONNECT_TO_SERVER_ERR;
    }
  }

  const put = async(urlPath: string, body: Object): Promise<ApiReturnValues> => {
    const requestOptions = {
      method: 'PUT',
      headers: headers.current,
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(url.current + urlPath, requestOptions);
      return handleResponse(response);
    }
    catch (error: any) {
      if(error?.error){
        return error
      }
      return CANT_CONNECT_TO_SERVER_ERR;
    }
  }

  // prefixed with underscore because delete is a reserved word in javascript
  const _delete = async(urlPath: string): Promise<ApiReturnValues> => {
    const requestOptions = {
      method: 'DELETE',
      headers: headers.current
    };
    try {
      const response = await fetch(url.current + urlPath, requestOptions);
      return handleResponse(response);
    }
    catch (error: any) {
      if(error?.error){
        return error
      }
      return CANT_CONNECT_TO_SERVER_ERR;
    }
  }

  const handleResponse = (response: any) => {
    if(response.headers.get('Authorization')){
      const authHeader = response.headers.get('Authorization');
      headers.current.set('Authorization', authHeader);
      localStorage.setItem('token', authHeader);
    }
    return response.text().then((text: string) => {
      const data = text && JSON.parse(text);
      return data;
    });
  }

  const logout = () => {
    headers.current.set('Authorization', '');
    localStorage.removeItem('token');
    setIsAuthenticated(false)
  }

  const callServiceMethod = (method: string, url?: string, params?: Object) => {
    if(url) {
      if(params){
        if(method === 'POST'){
          return post(url, params)
        }
        if(method === 'PUT'){
          return put(url, params)
        }
      }
      if(method === 'GET'){
        return get(url)
      }
      if(method === 'DELETE'){
        return _delete(url)
      }
    }
    if(method === 'LOGOUT'){
      return logout()
    }
  }

  const ApiService = async (method: string, url?: string, params?: Object) => {
    const response = await callServiceMethod(method, url, params)
    if(response?.status === 401){
      setIsAuthenticated(false)
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
  }

  return(
    <ApiServiceContext.Provider value={{ ApiService }}>
     {children}
    </ApiServiceContext.Provider>
  )
}

export const ApiServicer = () => useContext(ApiServiceContext)

export default ApiServiceWrapper