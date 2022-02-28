const ajaxUtil = {
  postAuth(url, data, callback = (resp: any) => null, errorCallback = (resp: any) => null) {
    url = `/auth${url}`;

    return fetch(url, {
      method: "post",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(obj => {
        callback(obj);
        return obj;
      })
      .catch(errorCallback);
  },
  post(url, data, callback = (resp: any) => {}, errorCallback = (resp: any) => {}) {
    return fetch(url, {
      method: "post",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(obj => {
        callback(obj);
        return obj;
      })
      .catch(errorCallback);
  },
  postWithFiles(url, data, callback = (resp: any) => {}, errorCallback = (resp: any) => {}) {
    return fetch(url, {
      method: "post",
      credentials: "include",
      body: data
    })
      .then(resp => resp.json())
      .then(callback)
      .catch(errorCallback);
  },
  postWithCors(url, data, callback = (resp: any) => {}, errorCallback = (resp: any) => {}) {
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(resp => resp.json())
      .then(obj => {
        callback(obj);
        return obj;
      })
      .catch(errorCallback);
  },
  postWithFilesCors(url, data, callback = (resp: any) => null, errorCallback = (resp: any) => null) {
    return fetch(url, {
      method: "POST",
      mode: "cors",
      body: data
    })
      .then(resp => resp.json())
      .then(callback)
      .catch(errorCallback);
  },
  ["get"](url, data): any {
    let queryString = Object.keys(data)
      .map(p => (Array.isArray(data[p]) ? data[p].map(val => `${p}[]=${val}`).join("&") : `${p}=${data[p]}`))
      .join("&")
      .replace(/&+/g, "&");

    return fetch(`${url}?${queryString}`, { method: "get", credentials: "include" }).then(resp => resp.json());
  },
  getWithCors(url, data): Promise<any> {
    let queryString = Object.keys(data)
      .map(p => (Array.isArray(data[p]) ? data[p].map(val => `${p}[]=${val}`).join("&") : `${p}=${data[p]}`))
      .join("&")
      .replace(/&+/g, "&");

    return fetch(`${url}?${queryString}`, {
      method: "get"
    }).then(resp => resp.json());
  }
};

export default ajaxUtil;

(<any>window).ajaxUtil = ajaxUtil;
