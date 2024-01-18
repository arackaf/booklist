<script lang="ts">
  export let isEmpty: boolean = false;

  let className = "";
  export { className as class };
</script>

<div class="grid grid-cols-1 sm:grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-2 {className}">
  <div>
    <slot name="select" />
  </div>
  <div class="flex items-center">
    <slot name="display" />
  </div>
</div>
