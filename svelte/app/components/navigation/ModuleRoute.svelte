<script>
  import Loadable from "@arackaf-svelte/svelte-loadable";
  import ModuleLoading from "./ModuleLoading.svelte";
  import navigationState from "./navigationState";
  const { navStore, moduleLoaded } = navigationState;

  export let moduleName;

  let componentLoaderFn;
  export { componentLoaderFn as loader };

  export let preload = () => void 0;

  $: active = $navStore.browsedModule == moduleName || $navStore.moduleLoaded == moduleName;

  const loader = () => Promise.all([componentLoaderFn(), preload()]).then(([Comp]) => Comp);
</script>

{#if active}
  <Loadable unloader={true} on:load={() => moduleLoaded(moduleName)} {loader}>
    <div style="display: contents;" slot="loading">
      <ModuleLoading />
    </div>
  </Loadable>
{/if}

