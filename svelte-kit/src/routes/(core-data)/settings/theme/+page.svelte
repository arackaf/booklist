<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import { NUM_THEMES } from "$lib/util/constants";

  import DemoStyles from "./DemoStyles.svelte";
  import ThemeOption from "./ThemeOption.svelte";

  let { data } = $props();
  let { uxState } = $derived(data);
  let { theme, wbg: whiteBg } = $derived(uxState);

  let whiteBgForm = $state<HTMLFormElement | null>(null);
  const themeNames = Array.from({ length: NUM_THEMES }, (_, i) => `scheme${i + 1}`);

  function setWhiteBg() {
    return async () => {
      invalidate("app:root");
    };
  }
</script>

<div class="flex xs:flex-row flex-col">
  <div>
    <form bind:this={whiteBgForm} method="POST" action="?/setWhiteBb" use:enhance={setWhiteBg}>
      <label style="font-size: 16px" class="checkbox mb-2">
        <input type="checkbox" name="whitebg" checked={whiteBg == "1"} onchange={() => whiteBgForm?.requestSubmit()} />
        White background
      </label>
    </form>
    {#each themeNames as name}
      <ThemeOption {theme} {name} />
    {/each}
  </div>
  <div class="xs:ml-auto xs:mr-auto ml-0 mr-0 demo-container">
    <DemoStyles />
  </div>
</div>
