export default class Api {

  url: string

  constructor() {
    this.url = 'http://localhost:8080';
  }

  async get(urlPath: string) {
    const requestOptions = {
      method: 'GET'
    };
    try{
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch(error){
      return error;
    }
  }

  async post(urlPath: string, body: Object) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    try{
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch(error){
      return error;
    }
  }

  async put(urlPath: string, body: JSON) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch(error){
      return error
    }
  }

  // prefixed with underscore because delete is a reserved word in javascript
  async _delete(urlPath: string) {
    const requestOptions = {
      method: 'DELETE'
    };
    try{
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch(error){
      return error;
    }
  }

  handleResponse(response: any) {
    return response.text().then((text: string) => {
      const data = text && JSON.parse(text);

      return data;
    });
  }
}