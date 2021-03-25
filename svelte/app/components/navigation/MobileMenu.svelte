<script>
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
    }
  })
</script>

<div bind:this={rootEl}>
  <div class="mobile-menu-content">
    <div>
      <div class="header">
        <a style="font-size: 1.4rem; align-self: start" on:click={onClose}>
          <i class="far fa-bars" />
        </a>
        <h3 style="margin: 0 0 0 10px; align-self: center">{title}</h3>
      </div>
      <slot />
    </div>
  </div>
</div>
