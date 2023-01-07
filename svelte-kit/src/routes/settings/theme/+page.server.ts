import { ONE_YEAR_SECONDS, THEME_COOKIE, WHITE_BG_COOKIE } from "$lib/util/constants";

export const actions = {
  async setTheme({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const theme = formData.get("theme");

    cookies.set(THEME_COOKIE, theme, { maxAge: ONE_YEAR_SECONDS });
  },
  async setWhiteBb({ request, cookies }: any) {
    const formData: URLSearchParams = await request.formData();

    const whiteBg = formData.get("whiteBg");

    cookies.set(WHITE_BG_COOKIE, whiteBg, { maxAge: ONE_YEAR_SECONDS });
  }
};
