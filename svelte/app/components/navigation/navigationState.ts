import { writable, derived } from "svelte/store";
import { appState } from "app/state/appState";

const navStoreRaw = writable({ modulesLoaded: {}, lastModuleLoaded: null });

export const navStore = derived([appState, navStoreRaw], ([$appState, $navState]) => ({ ...$navState, browsedModule: $appState.module }));

export const moduleLoaded = moduleName =>
  navStoreRaw.update(state => ({ ...state, lastModuleLoaded: moduleName, modulesLoaded: { ...state.modulesLoaded, [moduleName]: true } }));

export const moduleUnLoaded = moduleName => {
  navStoreRaw.update(state => ({ ...state, modulesLoaded: { ...state.modulesLoaded, [moduleName]: false } }));
};
