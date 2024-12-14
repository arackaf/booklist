<script lang="ts">
  import { enhance } from "$app/forms";
  import classNames from "classnames";
  import { invalidate } from "$app/navigation";

  type Props = {
    name: string;
    theme: string;
  };

  let { name, theme }: Props = $props();

  const arrayOfTen = Array.from({ length: 10 }, (_, i) => i + 1);

  function setTheme() {
    return async () => {
      invalidate("app:root");
    };
  }

  let active = $derived(theme === name);
  let addedClasses = $derived(active ? "border-4 border-[var(--primary-5)]" : "cursor-pointer border border-neutral-400");
</script>

<div class="flex">
  <form method="POST" action="?/setTheme" use:enhance={setTheme}>
    <input type="hidden" name="theme" value={name} />
    <button class={"p-2 flex flex-col rounded-lg mb-3 " + addedClasses}>
      <div class={classNames(name, "inline-flex flex-wrap")}>
        {#each arrayOfTen as val}
          <div class="lg:w-7 lg:h-7 xs:w-5 xs:h-5 w-6 h-6 mr-1 md:mr-2 lg:mr-3 last:mr-0" style={`background-color: var(--primary-${val})`}></div>
        {/each}
      </div>
    </button>
  </form>
</div>
