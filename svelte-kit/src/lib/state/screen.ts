import { writable, derived } from "svelte/store";

const _screenState = writable({
  isMobile: void 0 as unknown as boolean,
  desktopRequested: void 0 as unknown as boolean
});

export const setInitialState = (isMobile: boolean, desktopRequested: boolean) => {
  _screenState.update(state => {
    console.log("SERVER", typeof window === "undefined", "Current state", state, "passed", { isMobile, desktopRequested }, "NEW STATE", {
      ...state,
      isMobile,
      desktopRequested
    });
    if (typeof window === "undefined" || typeof state.isMobile === "undefined") {
      return {
        ...state,
        isMobile,
        desktopRequested
      };
    }

    return state;
  });
};

export const requestDesktop = () => {
  _screenState.update(val => ({ ...val, desktopRequested: true }));
};

export const requestMobile = () => {
  _screenState.update(val => ({ ...val, desktopRequested: false }));
};

export const screenState = derived(_screenState, $state => {
  return {
    isMobile: $state.isMobile,
    isDesktop: !$state.isMobile,
    showDesktop: $state.desktopRequested || !$state.isMobile
  };
});
