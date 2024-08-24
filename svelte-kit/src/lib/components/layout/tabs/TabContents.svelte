<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";

  type Props = {
    tabName: string;
  } & HTMLAttributes<HTMLDivElement>;
  let { class: className, ...rest }: Props = $props();
</script>

<div class={className} {...rest}>
  <slot />
</div>
