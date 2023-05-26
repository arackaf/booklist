<script lang="ts">
  export let labelText: string;
</script>

<div>
  <label class="flex flex-col gap-0.5" for="fc2">
    <span class="text-sm">{labelText}</span>
    <slot name="input" />
  </label>
</div>
