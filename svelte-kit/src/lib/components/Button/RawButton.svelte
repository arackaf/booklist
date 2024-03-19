<script lang="ts">
  let className = "";
  export { className as class };

  export let color = "text-neutral-600";
  export let cursor = "cursor-pointer";

  const { className: ignore, ...rest } = $$restProps;
</script>

<button class="p-0 bg-transparent border-0 {color} {cursor} shadow-none {className}" on:click {...rest}>
  <slot />
</button>
