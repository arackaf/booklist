import { writable, derived } from "svelte/store";

const _screenState = writable({
  isMobile: false,
  desktopRequested: false
});

export const setIsMobile = (val: boolean) => {
  _screenState.update(state => ({ ...state, isMobile: val }));
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
