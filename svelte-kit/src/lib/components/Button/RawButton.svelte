<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let className = "";

  type Props = {
    color?: string;
    cursor?: string;
    onClick: HTMLAttributes<HTMLButtonElement>["onclick"];
  } & HTMLAttributes<HTMLButtonElement>;

  let { children, onClick, color = "text-neutral-600", cursor = "cursor-pointer", ...rest }: Props = $props();
</script>

<button class="p-0 bg-transparent border-0 {color} {cursor} shadow-none {className}" onclick={onClick} {...rest}>
  <slot />
</button>
