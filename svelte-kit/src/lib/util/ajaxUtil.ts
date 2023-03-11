export const ajaxUtil = {
  async post(url: string, data: any, onSuccess: (data: any) => void = () => {}, onError: (err: any) => void = () => {}) {
    const payload = data instanceof FormData ? data : JSON.stringify(data);

    try {
      const resp = await fetch(url, { method: "POST", body: payload }).then(resp => resp.json());
      onSuccess(resp);
      return resp;
    } catch (er) {
      onError(er);
      return null;
    }
  }
};
