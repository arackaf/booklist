<script lang="ts">
  import "./theme-chooser.scss";
  import type { PageData } from "./$types";

  import { NUM_THEMES } from "$lib/util/constants";

  import DemoStyles from "./DemoStyles.svelte";
  import ThemeOption from "./ThemeOption.svelte";

  const themeNames = Array.from({ length: NUM_THEMES }, (v, i) => `scheme${i + 1}`);

  export let data: PageData;
  $: ({ theme, whiteBb } = data);

  const setWhiteBackground = () => {};
</script>

<div class="theme-chooser-root">
  <div class="theme-chooser-list">
    <label style="font-size: 16px" class="checkbox margin-bottom">
      <input type="checkbox" checked={whiteBb} on:change={setWhiteBackground} />
      White background
    </label>
    {#each themeNames as name}
      <ThemeOption {theme} {name} />
    {/each}
  </div>
  <div class="demo-container">
    <DemoStyles />
  </div>
</div>
