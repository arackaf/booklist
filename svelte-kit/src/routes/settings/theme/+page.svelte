<script lang="ts">
  import "./theme-chooser.scss";
  import type { PageData } from "./$types";

  import classNames from "classnames";

  import { NUM_THEMES } from "$lib/util/constants";
  import Stack from "$lib/components/layout/Stack.svelte";

  import DemoStyles from "./DemoStyles.svelte";

  const themeNames = Array.from({ length: NUM_THEMES }, (v, i) => `scheme${i + 1}`);
  const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);

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
      <Stack on:click={() => {}} class={classNames("theme-chooser-item", { active: theme == name })} tightest={true}>
        <div class={classNames(name, "theme-chooser")}>
          {#each arrayOfTen as val}
            <div style={`background-color: var(--primary-${val})`} />
          {/each}
        </div>
      </Stack>
    {/each}
  </div>
  <div class="demo-container">
    <DemoStyles />
  </div>
</div>
