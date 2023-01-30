<script lang="ts">
  import "./theme-chooser.scss";

  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import type { PageData } from "./$types";

  import { NUM_THEMES } from "$lib/util/constants";

  import DemoStyles from "./DemoStyles.svelte";
  import ThemeOption from "./ThemeOption.svelte";

  const themeNames = Array.from({ length: NUM_THEMES }, (v, i) => `scheme${i + 1}`);

  export let data: PageData;
  $: ({ uxState } = data);
  $: ({ theme, wbg: whiteBg } = uxState);

  let whiteBgForm: HTMLFormElement;

  function setWhiteBg() {
    return async () => {
      invalidate("app-root");
    };
  }
</script>

<div class="theme-chooser-root">
  <div class="theme-chooser-list">
    <form bind:this={whiteBgForm} method="POST" action="?/setWhiteBb" use:enhance={setWhiteBg}>
      <label style="font-size: 16px" class="checkbox margin-bottom">
        <input type="checkbox" name="whitebg" checked={whiteBg == "1"} on:change={() => whiteBgForm.requestSubmit()} />
        White background
      </label>
    </form>
    {#each themeNames as name}
      <ThemeOption {theme} {name} />
    {/each}
  </div>
  <div class="demo-container">
    <DemoStyles />
  </div>
</div>
