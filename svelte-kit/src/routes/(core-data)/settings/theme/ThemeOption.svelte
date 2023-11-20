<script lang="ts">
  import { enhance } from "$app/forms";
  import classNames from "classnames";
  import { invalidate } from "$app/navigation";

  export let name: string;
  export let theme: string;

  const arrayOfTen = Array.from({ length: 10 }, (_, i) => i + 1);
  let formEl: HTMLFormElement;

  function setTheme() {
    return async () => {
      invalidate("app:root");
    };
  }
</script>

<form bind:this={formEl} method="POST" action="?/setTheme" use:enhance={setTheme}>
  <input type="hidden" name="theme" value={name} />
  <div
    on:keypress={() => {}}
    on:click={() => formEl.requestSubmit()}
    class={classNames("theme-chooser-item flex flex-col rounded-lg border border-neutral-400 cursor-pointer mb-3 p-2", { active: theme == name })}
  >
    <div class={classNames(name, "theme-chooser")}>
      {#each arrayOfTen as val}
        <div style={`background-color: var(--primary-${val})`} />
      {/each}
    </div>
  </div>
</form>
