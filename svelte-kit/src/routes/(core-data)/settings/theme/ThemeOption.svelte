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

  $: active = theme === name;

  $: addedClasses = active ? "border-4 border-[var(--primary-5)]" : "cursor-pointer border border-neutral-400";
</script>

<form bind:this={formEl} method="POST" action="?/setTheme" use:enhance={setTheme}>
  <input type="hidden" name="theme" value={name} />
  <div on:keypress={() => {}} on:click={() => formEl.requestSubmit()} class={"p-2 flex flex-col rounded-lg mb-3 " + addedClasses}>
    <div class={classNames(name, "theme-chooser inline-flex flex-wrap")}>
      {#each arrayOfTen as val}
        <div class="w-8 h-8 mr-3 last:mr-0" style={`background-color: var(--primary-${val})`} />
      {/each}
    </div>
  </div>
</form>
