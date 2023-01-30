<script lang="ts">
  import { enhance } from "$app/forms";
  import classNames from "classnames";
  import Stack from "$lib/components/layout/Stack.svelte";
  import { invalidate } from "$app/navigation";

  export let name: string;
  export let theme: string;

  const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);
  let formEl: HTMLFormElement;

  function setTheme() {
    return async () => {
      invalidate("app-root");
    };
  }
</script>

<form bind:this={formEl} method="POST" action="?/setTheme" use:enhance={setTheme}>
  <input type="hidden" name="theme" value={name} />
  <Stack on:click={() => formEl.requestSubmit()} class={classNames("theme-chooser-item", { active: theme == name })} tightest={true}>
    <div class={classNames(name, "theme-chooser")}>
      {#each arrayOfTen as val}
        <div style={`background-color: var(--primary-${val})`} />
      {/each}
    </div>
  </Stack>
</form>
