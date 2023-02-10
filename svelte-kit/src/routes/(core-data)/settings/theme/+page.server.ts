import { updateUxState } from "$lib/util/uxState";

export const actions = {
  async setTheme({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const theme = formData.get("theme");

    updateUxState(cookies, { theme });
  },
  async setWhiteBb({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const whiteBg = formData.get("whitebg") == "on" ? 1 : 0;

    updateUxState(cookies, { wbg: whiteBg });
  }
};
