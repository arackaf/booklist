<script lang="ts">
  export let error = false;

  let className = "";
  export { className as class };

  const { className: ignore, ...rest } = $$restProps;
</script>

<input
  class:border-neutral-400={!error}
  class:border-danger-5={error}
  class:focus:shadow-md={!error}
  class:focus:shadow-sm={error}
  class:focus:shadow-danger-7={error}
  class="bg-white text-neutral-600 border rounded h-8 py-1 px-3 text-base md:text-sm block w-full transition-box-shadow {className}"
  {...rest}
/>
