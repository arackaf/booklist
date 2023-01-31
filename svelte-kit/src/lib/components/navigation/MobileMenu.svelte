<script lang="ts">
  import { onMount } from "svelte";

  export let onClose: () => void;
  export let title = "";
  export let open: boolean;
  const menuHolder = typeof document === "object" ? document.getElementById("main-mobile-menu") : null;

  $: {
    let isOpen = open;
    menuHolder?.classList[isOpen ? "add" : "remove"]("open");
  }

  let rootEl: HTMLElement;

  onMount(() => {
    const menuContent = rootEl.firstElementChild!;
    menuHolder!.appendChild(menuContent);

    return () => {
      rootEl.appendChild(menuContent);
    };
  });
</script>

<div bind:this={rootEl} style="display: none;">
  <div class="mobile-menu-content">
    <div>
      <div class="header">
        <button class="raw-button icon-button" aria-label="Close mobile menu" on:click={onClose}>
          <i class="far fa-times" />
        </button>
        <h3>{title}</h3>
      </div>
      <slot />
    </div>
  </div>
</div>
