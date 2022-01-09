export default class Api {

  url: string

  constructor() {
   this.url = 'https://powerful-wildwood-85998.herokuapp.com';
  }

  async get(urlPath: string) {
   const requestOptions = {
    method: 'GET'
   };
   const response = await fetch(this.url + urlPath, requestOptions);
    return this.handleResponse(response);
  }
 
  async post(urlPath: string, body: JSON) {
   const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
   };
   const response = await fetch(this.url + urlPath, requestOptions);
    return this.handleResponse(response);
  }
 
  async put(urlPath: string, body: JSON) {
   const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
   };
   const response = await fetch(this.url + urlPath, requestOptions);
    return this.handleResponse(response);
  }
 
  // prefixed with underscore because delete is a reserved word in javascript
  async _delete(urlPath: string) {
   const requestOptions = {
    method: 'DELETE'
   };
   const response = await fetch(this.url + urlPath, requestOptions);
    return this.handleResponse(response);
  }
 
  handleResponse(response: any) {
   return response.text().then((text: string) => {
    const data = text && JSON.parse(text);
 
    return data;
   });
  }
 }