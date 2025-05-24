<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { XIcon } from "lucide-svelte";

  import Button from "$lib/components/ui/button/button.svelte";

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
  <div class="flex flex-col gap-2 mb-2">
    <div class="flex items-center header">
      <h3 class="leading-none ml-2 text-lg">{title}</h3>
      <Button aria-label="Close mobile menu" variant="outline" size="icon" onclick={onClose} class="text-lg border-0 ml-auto p-1 w-8 h-8">
        <XIcon class="h-5! w-5!" />
      </Button>
    </div>
    {@render children()}
  </div>
</div>
