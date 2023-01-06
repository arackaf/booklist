import { setInitialState } from "$lib/state/screen";

export async function load({ isDataRequest, data }: any) {
  setInitialState(data.isMobile, false);

  return data;
}
