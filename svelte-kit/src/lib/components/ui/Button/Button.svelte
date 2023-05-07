<script lang="ts">
  export let type: "primary" | "danger" | "default" = "default";
  export let disabled: boolean;

  $: isPrimary = type === "primary";
</script>

<button
  class:bg-primary-5={isPrimary}
  class:text-primary-10={isPrimary}
  class:focus:shadow-primary-7={isPrimary}
  class:border-primary-5={isPrimary}
  class:cursor-not-allowed={disabled}
  class="m-0 rounded py-1.5 px-3 text-base focus:shadow-md border-2 transition-[box-shadow]"
  {disabled}
>
  <slot />
</button>
