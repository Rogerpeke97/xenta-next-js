import Router from "next/router"

const CANT_CONNECT_TO_SERVER_ERR = {
  error: 'Can\'t connect to the server',
  ok: false,
  message: '',
  status: 503,
  data: {}
}
export interface ApiReturnValues {
  error: String | Boolean,
  ok: Boolean,
  message: String,
  data: any,
  status?: number
}
export interface Api {
  (method: string, url?: string, params?: Object): Promise<ApiReturnValues>
}
const headers = new Headers()
const url = 'http://localhost:8080'
headers.set('Content-Type', 'application/json')
headers.set('Accept', 'application/json')
if(typeof window !== 'undefined'){
  headers.set('Authorization', localStorage.getItem('token') ?? '')
}
  
const get = async(urlPath: string)  => {
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  try {
    const response = await fetch(url + urlPath, requestOptions);
    const authHeader = response.headers.get('Authorization') ?? '';
    if(authHeader?.length > 0){
      headers.set('Authorization', authHeader);
    }
    return handleResponse(response);
  }
  catch (error: any) {
    if(error?.error){
      return error
    }
  }
}

const post = async(urlPath: string, body: Object) => {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  };
  try {
    const response = await fetch(url + urlPath, requestOptions);
    return handleResponse(response);
  }
  catch (error: any) {
    if(error?.error){
      return error
    }
  }
}

const put = async(urlPath: string, body: Object) => {
  const requestOptions = {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(body)
  };
  try {
    const response = await fetch(url + urlPath, requestOptions);
    return handleResponse(response);
  }
  catch (error: any) {
    if(error?.error){
      return error
    }
  }
}

// prefixed with underscore because delete is a reserved word in javascript
const _delete = async(urlPath: string) => {
  const requestOptions = {
    method: 'DELETE',
    headers: headers
  };
  try {
    const response = await fetch(url + urlPath, requestOptions);
    return handleResponse(response);
  }
  catch (error: any) {
    if(error?.error){
      return error
    }
  }
}

const handleResponse = (response: any) => {
  if(response.headers.get('Authorization')){
    const authHeader = response.headers.get('Authorization');
    headers.set('Authorization', authHeader);
    localStorage.setItem('token', authHeader);
  }
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);
    return data;
  });
}

const logout = () => {
  headers.set('Authorization', '');
  localStorage.removeItem('token');
  Router.push('/login')
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

export const ApiService: Api = async (method: string, url?: string, params?: Object) => {
  const response = await callServiceMethod(method, url, params)
  if(response && response.error){
    // setToast({
    //   messages: [{
    //     message: response.error,
    //     type: 'error'
    //   }],
    //   displayToast: true
    // })
  }
  return response || CANT_CONNECT_TO_SERVER_ERR
}
