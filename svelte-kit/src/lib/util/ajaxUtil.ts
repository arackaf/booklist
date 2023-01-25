export const ajaxUtil = {
  post(url: string, data: any, onSuccess: (data: any) => void = () => {}, onError: (err: any) => void = () => {}) {
    const payload = data instanceof FormData ? data : JSON.stringify(data);

    return fetch(url, { method: "POST", body: payload })
      .then(resp => resp.json())
      .then(resp => {
        onSuccess(resp);
        return resp;
      });
  }
};
