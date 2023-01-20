import { ONE_YEAR_SECONDS } from "./constants";

export type GRID_VIEW = "tbl";
export type BASIC_LIST_VIEW = "mbl";
export type COVERS_LIST = "cov";

export const GRID_VIEW = "tbl";
export const BASIC_LIST_VIEW = "mbl";
export const COVERS_LIST = "cov";

export type UxState = {
  theme: string;
  wbg: string;
  bkVw: string;
  desktopRequested: string;
};

export const getUxState = (cookies: any) => {
  try {
    let state: string | UxState = cookies.get("ux-state");
    if (!state) {
      state = defaultUxState();
      saveUxState(cookies, state);
      return state;
    } else {
      return parseUxState(state as string) as UxState;
    }
  } catch (e) {
    console.log("Caught");
    const result = defaultUxState();
    setTimeout(() => {
      saveUxState(cookies, result);
    });
    return result;
  }
};

const saveUxState = (cookies: any, state: UxState) => {
  cookies.set("ux-state", stringifyUxState(state), { path: "/", maxAge: ONE_YEAR_SECONDS });
};

export const updateUxState = (cookies: any, updates: object) => {
  const uxState = getUxState(cookies);
  Object.assign(uxState, updates);
  saveUxState(cookies, uxState);
};

const stringifyUxState = (state: UxState): string => {
  return Object.entries(state)
    .reduce((result, pair) => {
      result.push(`${pair[0]}-${pair[1]}`);
      return result;
    }, [] as string[])
    .join("_");
};

const parseUxState = (state: string): UxState => {
  const valuePairs = state.split("_");
  const result = valuePairs.reduce((result, pairing) => {
    const [k, v] = pairing.split("-");
    result[k] = v;
    return result;
  }, {} as any);

  Object.keys(defaultUxState()).forEach(k => {
    if (typeof result[k] !== "string") {
      throw "Bad parse;";
    }
  });

  return result as UxState;
};

const defaultUxState = (): UxState => {
  return {
    theme: "scheme1",
    wbg: "0",
    bkVw: GRID_VIEW,
    desktopRequested: "0"
  };
};
