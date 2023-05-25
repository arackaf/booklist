<script lang="ts">
  export let error = false;
</script>

<input
  class:border-neutral-400={!error}
  class:border-danger-5={error}
  class="bg-white text-neutral-600 border rounded h-8 py-1 px-3 text-base md:text-sm block w-full"
/>
