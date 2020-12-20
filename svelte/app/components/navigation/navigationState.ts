import { writable, derived } from "svelte/store";
import { appState } from "app/state/appState";

const navStore = writable({ modulesLoaded: {}, lastModuleLoaded: null });
const moduleLoaded = moduleName =>
  navStore.update(state => ({ ...state, lastModuleLoaded: moduleName, modulesLoaded: { ...state.modulesLoaded, [moduleName]: true } }));
  
const moduleUnLoaded = moduleName => {
  console.log("UNLOADED", moduleName);
  navStore.update(state => ({ ...state, modulesLoaded: { ...state.modulesLoaded, [moduleName]: false } }));
};

export default {
  navStore: derived([appState, navStore], ([$appState, $navState]) => ({ ...$navState, browsedModule: $appState.module })),
  moduleLoaded,
  moduleUnLoaded
};
