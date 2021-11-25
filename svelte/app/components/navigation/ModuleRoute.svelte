<script lang="ts">
  // pending https://github.com/sveltejs/vite-plugin-svelte/issues/217
  // import Loadable from "svelte-loadable/Loadable.svelte";
  import Loadable from "./Loadable.svelte";
  import ModuleLoading from "./ModuleLoading.svelte";
  import { navStore, moduleLoaded, moduleUnLoaded } from "./navigationState";

  export let moduleName;

  let componentLoaderFn: any;
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
  const unloader: any = () => moduleUnLoaded(moduleName);
</script>

{#if active}
  <Loadable {unloader} on:load={() => moduleLoaded(moduleName)} {loader}>
    <div style="display: contents;" slot="loading">
      <ModuleLoading />
    </div>
  </Loadable>
{/if}
