<script lang="ts">
  import type { Snippet } from "svelte";
  import RawButton from "../Button/RawButton.svelte";

  type Props = {
    href: string;
    style?: string;
    disabled?: boolean;
    onClick?: (() => void) | null;
    label?: string;
    active?: boolean;
    padding?: string;
    children: Snippet;
  };

  let { href, style = "", disabled = false, onClick = null, label = "", active = false, padding = "px-3 sm:px-4", children }: Props = $props();

  const linkClicked = (evt: any) => {
    if (!onClick || disabled) {
      return;
    }

    evt.preventDefault();
    onClick();
  };

  let bgColorClass = $derived(active ? "bg-[var(--primary-6)]" : "");
  let colorClass = $derived(disabled ? "text-[var(--primary-7)]" : "text-[var(--primary-10)]");
  let cursorClass = $derived(disabled || active ? "cursor-default" : undefined);
</script>

{#if href}
  <a
    class="flex items-center {colorClass} {bgColorClass} {cursorClass} {padding} touch-manipulation"
    onclick={linkClicked}
    href={disabled ? null : href}
    {style}
    aria-label={label}
  >
    {@render children()}
  </a>
{:else}
  <RawButton
    class="flex items-center touch-manipulation {bgColorClass} {padding}"
    color={colorClass}
    cursor={cursorClass}
    onClick={linkClicked}
    {style}
    aria-label={label}
  >
    {@render children()}
  </RawButton>
{/if}
