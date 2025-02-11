<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import RawButton from "../Button/RawButton.svelte";

  type Props = {
    onClose: () => void;
    title: string;
    open: boolean;
    children: Snippet;
  };
  let { onClose, title, open, children }: Props = $props();

  const menuHolder = typeof document === "object" ? document.getElementById("main-mobile-menu") : null;

  // TODO: move all this control state into a shared rune
  $effect(() => {
    menuHolder?.classList[open ? "add" : "remove"]("open");
  });

  let rootEl: HTMLElement;
  let menuContent: HTMLElement;

  const windowClickHandler = (evt: MouseEvent) => {
    if (!open) {
      return;
    }
    let clickedEl = evt.target as HTMLElement | null;
    while (clickedEl) {
      if (clickedEl == menuContent || clickedEl.hasAttribute("data-mobile-menu")) {
        return;
      }
      clickedEl = clickedEl?.parentElement;
    }
    onClose?.();
  };

  onMount(() => {
    menuContent = rootEl.firstElementChild! as HTMLElement;
    menuHolder!.appendChild(menuContent);

    window.addEventListener("click", windowClickHandler);

    return () => {
      rootEl.appendChild(menuContent);
      window.removeEventListener("click", windowClickHandler);
    };
  });
</script>

<div bind:this={rootEl} class="hidden">
  <div>
    <div>
      <div class="flex items-center header">
        <RawButton aria-label="Close mobile menu" class="text-[1.4rem] ml-[2px]" onClick={onClose}>
          <i class="far fa-times"></i>
        </RawButton>
        <h3 class="leading-none ml-2 text-lg">{title}</h3>
      </div>
      {@render children()}
    </div>
  </div>
</div>
