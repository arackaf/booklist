<script lang="ts">
  import { onMount } from "svelte";
  import RawButton from "../ui/Button/RawButton.svelte";

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

<div bind:this={rootEl} class="hidden">
  <div class="mobile-menu-content">
    <div>
      <div class="flex items-center header">
        <RawButton aria-label="Close mobile menu" on:click={onClose}>
          <i class="far fa-times" />
        </RawButton>
        <h3 class="leading-none">{title}</h3>
      </div>
      <slot />
    </div>
  </div>
</div>
