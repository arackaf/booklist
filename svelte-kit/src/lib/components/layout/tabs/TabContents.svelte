<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  type Props = HTMLAttributes<HTMLDivElement>;
  let { children, ...rest }: Props = $props();
</script>

<div {...rest}>
  {@render children!()}
</div>
