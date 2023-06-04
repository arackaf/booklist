<script lang="ts">
  import RawButton from "../ui/Button/RawButton.svelte";

  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (() => void) | null = null;
  export let label: string = "";

  const linkClicked = (evt: any) => {
    if (!onClick || disabled) {
      return;
    }

    evt.preventDefault();
    onClick();
  };

  $: colorClass = disabled ? "text-[var(--primary-7)]" : "text-[var(--primary-10)]";
  $: cursorClass = disabled ? "cursor-default" : undefined;
</script>

{#if href}
  <a class={colorClass} on:click={linkClicked} href={disabled ? null : href} {style} aria-label={label}>
    <slot />
  </a>
{:else}
  <RawButton color={colorClass} cursor={cursorClass} on:click={linkClicked} {style} aria-label={label}>
    <slot />
  </RawButton>
{/if}
