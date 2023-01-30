<script lang="ts">
  export let href: string;
  export let style = "";
  export let disabled = false;
  export let onClick: (() => void) | null = null;
  export let label: string = "";

  const linkClicked = (evt: any) => {
    if (!onClick) {
      return;
    }

    evt.preventDefault();
    onClick();
  };
</script>

<a on:click={linkClicked} href={disabled ? null : href} {style} aria-label={label}>
  <slot />
</a>
