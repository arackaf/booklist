<script>
  import Loadable from "svelte-loadable";
  import ModuleLoading from "./ModuleLoading.svelte";
  import { navStore, moduleLoaded, moduleUnLoaded } from "./navigationState";

  export let moduleName;

  let componentLoaderFn;
  export { componentLoaderFn as loader };

  export let preload = () => void 0;

  $: active =
    ($navStore.browsedModule == moduleName || $navStore.lastModuleLoaded == moduleName) &&
    !($navStore.browsedModule != moduleName && $navStore.modulesLoaded[$navStore.browsedModule]);

  $: {
    if ($navStore.browsedModule == moduleName && $navStore.modulesLoaded[moduleName]) {
      moduleLoaded(moduleName);
    }
  }

  const loader = () => Promise.all([componentLoaderFn(), preload()]).then(([Comp]) => Comp);
</script>

{#if active}
  <Loadable unloader={() => moduleUnLoaded(moduleName)} on:load={() => moduleLoaded(moduleName)} {loader}>
    <div style="display: contents;" slot="loading">
      <ModuleLoading />
    </div>
  </Loadable>
{/if}

