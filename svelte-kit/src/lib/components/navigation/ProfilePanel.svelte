<script lang="ts">
  import { onMount } from "svelte";
  import type { Login } from "$lib/types";

  export let open = false;
  export let onClose = () => {};

  export let loggedInUser: Login;

  const windowClickHandler = (evt: MouseEvent) => {
    if (!open) {
      return;
    }
    let clickedEl = evt.target as HTMLElement | null;
    while (clickedEl) {
      if (clickedEl == el || clickedEl.classList.contains("profile-menu-trigger")) {
        return;
      }
      clickedEl = clickedEl?.parentElement;
    }
    onClose();
  };

  let el;

  onMount(() => {
    window.addEventListener("click", windowClickHandler);
  });
</script>

<div bind:this={el} class:open class="sliding-mobile-menu z-30 top-0 left-0 w-72 h-96">
  <div class="flex flex-col p-3">
    <div class="flex gap-2 items-center">
      <img class="w-14 h-14 rounded-full" src={loggedInUser.image} />
      <span class="text-xl">{loggedInUser.name}</span>
    </div>
  </div>
</div>
