<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import { NUM_THEMES } from "$lib/util/constants";

  import DemoStyles from "./DemoStyles.svelte";
  import ThemeOption from "./ThemeOption.svelte";

  const themeNames = Array.from({ length: NUM_THEMES }, (_, i) => `scheme${i + 1}`);

  export let data;
  $: ({ uxState } = data);
  $: ({ theme, wbg: whiteBg } = uxState);

  let whiteBgForm: HTMLFormElement;

  function setWhiteBg() {
    return async () => {
      invalidate("app:root");
    };
  }
</script>

<div class="flex sm:flex-row flex-col">
  <div>
    <form bind:this={whiteBgForm} method="POST" action="?/setWhiteBb" use:enhance={setWhiteBg}>
      <label style="font-size: 16px" class="checkbox mb-2">
        <input type="checkbox" name="whitebg" checked={whiteBg == "1"} on:change={() => whiteBgForm.requestSubmit()} />
        White background
      </label>
    </form>
    {#each themeNames as name}
      <ThemeOption {theme} {name} />
    {/each}
  </div>
  <div class="sm:ml-auto ml-0 demo-container">
    <DemoStyles />
  </div>
</div>
