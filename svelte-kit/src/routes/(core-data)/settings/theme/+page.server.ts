import { updateUxState } from "$lib/util/uxState";

export const actions = {
  async setTheme({ request, cookies }) {
    const formData: FormData = await request.formData();

    const theme = formData.get("theme") as string;

    updateUxState(cookies, { theme });
  },
  async setWhiteBb({ request, cookies }) {
    const formData: FormData = await request.formData();

    const whiteBg = formData.get("whitebg") == "on" ? "1" : "0";

    updateUxState(cookies, { wbg: whiteBg });
  }
};
