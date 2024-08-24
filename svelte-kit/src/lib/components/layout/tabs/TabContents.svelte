<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLDivElement>;
  let { ...rest }: Props = $props();
</script>

<div {...rest}>
  <slot />
</div>
