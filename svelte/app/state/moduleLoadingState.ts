import { writable, derived } from "svelte/store";
import { setContext } from "svelte";

export function setupModuleState() {
  let moduleStateRaw = writable({ loaded: false, exiting: false });
  const moduleState = derived(moduleStateRaw, $state => ({ ...$state, active: !$state.exiting && $state.loaded }));

  setContext("module-context", moduleState);
  function loaded() {
    moduleStateRaw.update(state => ({ ...state, loaded: true }));
  }
  function exiting() {
    moduleStateRaw.update(state => ({ ...state, exiting: true }));
  }

  return { moduleState, loaded, exiting };
}
