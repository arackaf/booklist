<script lang="ts">
  type Props = {
    labelText: string;
  };
  let { labelText }: Props = $props();
</script>

<div>
  <label class="flex flex-col gap-0.5">
    <span class="text-sm">{labelText}</span>
    <slot name="select" />
  </label>
</div>
