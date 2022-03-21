<script lang="ts">
  import { onMount } from "svelte";

  export let onClose;
  export let title = "";
  export let open;
  const menuHolder = document.getElementById("main-mobile-menu");

  $: {
    let isOpen = open;
    menuHolder.classList[isOpen ? "add" : "remove"]("open");
  }

  let rootEl;

  onMount(() => {
    const menuContent = rootEl.firstElementChild;
    menuHolder.appendChild(menuContent);

    return () => {
      rootEl.appendChild(menuContent);
    };
  });
</script>

<div bind:this={rootEl}>
  <div class="mobile-menu-content">
    <div>
      <div class="header">
        <button class="raw-button icon-button" on:click={onClose}>
          <i class="far fa-times" />
        </button>
        <h3>{title}</h3>
      </div>
      <slot />
    </div>
  </div>
</div>
