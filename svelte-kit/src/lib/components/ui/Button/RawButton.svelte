<script lang="ts">
  let className = "";
  export { className as class };

  const { className: ignore, ...rest } = $$restProps;
</script>

<button class={`p-0 bg-transparent border-0 text-neutral-600 cursor-pointer shadow-none ${className}`} on:click {...rest}>
  <slot />
</button>
