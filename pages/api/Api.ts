interface ApiReturnValues {
  error: [String, any],
  ok: Boolean,
  message: String,
}


export default class Api {

  url: string
  headers: Headers

  constructor() {
    this.url = 'http://localhost:8080';
    this.headers = new Headers();
    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Accept', 'application/json');
    this.headers.set('Authorization', localStorage?.getItem('token') ?? '');
  }

  async get(urlPath: string): Promise<ApiReturnValues> {
    const requestOptions = {
      method: 'GET',
      headers: this.headers
    };
    try {
      const response = await fetch(this.url + urlPath, requestOptions);
      const authHeader = response.headers.get('Authorization') ?? '';
      if(authHeader?.length > 0){
        this.headers.set('Authorization', authHeader);
      }
      return this.handleResponse(response);
    }
    catch (error: any) {
      return error;
    }
  }

  async post(urlPath: string, body: Object): Promise<ApiReturnValues> {
    const requestOptions = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch (error: any) {
      return error;
    }
  }

  async put(urlPath: string, body: JSON): Promise<ApiReturnValues> {
    const requestOptions = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch (error: any) {
      return error
    }
  }

  // prefixed with underscore because delete is a reserved word in javascript
  async _delete(urlPath: string): Promise<ApiReturnValues> {
    const requestOptions = {
      method: 'DELETE',
      headers: this.headers
    };
    try {
      const response = await fetch(this.url + urlPath, requestOptions);
      return this.handleResponse(response);
    }
    catch (error: any) {
      return error;
    }
  }

  handleResponse(response: any) {
    if(response.headers.get('Authorization')){
      const authHeader = response.headers.get('Authorization');
      this.headers.set('Authorization', authHeader);
      localStorage.setItem('token', authHeader);
    }
    return response.text().then((text: string) => {
      const data = text && JSON.parse(text);
      return data;
    });
  }
}