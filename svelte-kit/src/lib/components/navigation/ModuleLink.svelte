<script lang="ts">
  import RawButton from "../ui/Button/RawButton.svelte";

  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (() => void) | null = null;
  export let label: string = "";
  export let active = false;
  export let padding = "px-3 sm:px-4";

  const linkClicked = (evt: any) => {
    if (!onClick || disabled) {
      return;
    }

    evt.preventDefault();
    onClick();
  };

  $: bgColorClass = active ? "bg-[var(--primary-6)]" : "";
  $: colorClass = disabled ? "text-[var(--primary-7)]" : "text-[var(--primary-10)]";
  $: cursorClass = disabled || active ? "cursor-default" : undefined;
</script>

{#if href}
  <a
    class="flex items-center {colorClass} {bgColorClass} {cursorClass} {padding} touch-manipulation"
    on:click={linkClicked}
    href={disabled ? null : href}
    {style}
    aria-label={label}
  >
    <slot />
  </a>
{:else}
  <RawButton
    class="flex items-center touch-manipulation {bgColorClass} {padding}"
    color={colorClass}
    cursor={cursorClass}
    on:click={linkClicked}
    {style}
    aria-label={label}
  >
    <slot />
  </RawButton>
{/if}
