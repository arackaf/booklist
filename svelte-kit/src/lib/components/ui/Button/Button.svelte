<script lang="ts">
  export let type: "primary" | "danger" | "default" = "default";
  export let disabled: boolean = false;
  export let icon: boolean = false;

  let className = "";
  export { className as class };

  $: isPrimary = type === "primary";

  $: defaultButton = !isPrimary;
</script>

<button
  class:bg-primary-5={isPrimary}
  class:text-primary-10={isPrimary}
  class:focus:shadow-primary-7={isPrimary}
  class:border-primary-5={isPrimary}
  class:bg-white={defaultButton}
  class:border-neutral-400={defaultButton}
  class:text-neutral-700={defaultButton}
  class:leading-none={icon}
  class:px-3={!icon}
  class:px-1.5={icon}
  class={`m-0 rounded border py-1.5 px-3 text-base focus:shadow-md transition-[box-shadow,opacity] ${className}`}
  class:cursor-not-allowed={disabled}
  class:opacity-50={disabled}
  {disabled}
  on:click
>
  <slot />
</button>
