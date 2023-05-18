<script lang="ts">
  export let isEmpty: boolean;

  $: verticalGap = isEmpty ? "gap-0" : "gap-2";
</script>

<div class={`grid grid-cols-1 ${verticalGap} md:grid-cols-4 md:col-span-2 md:gap-0`}>
  <div>
    <slot name="select" />
  </div>
  <div class="md:col-span-3 flex items-center">
    <slot name="display" />
  </div>
</div>
