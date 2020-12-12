import { writable, derived } from "svelte/store";
import { appState } from "app/state/appState";

const navStore = writable({ moduleLoaded: null });
const moduleLoaded = moduleName => navStore.update(state => ({ ...state, moduleLoaded: moduleName }));

export default {
  navStore: derived([appState, navStore], ([$appState, $navState]) => ({ ...$navState, browsedModule: $appState.module })),
  moduleLoaded
};

