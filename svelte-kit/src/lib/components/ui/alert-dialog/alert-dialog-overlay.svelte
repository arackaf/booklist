<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import { cn } from "$lib/utils";
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  type $$Props = AlertDialogPrimitive.OverlayProps & { onHide(): void };

  let className: $$Props["class"] = undefined;
  export let transition: $$Props["transition"] = fade;
  export let transitionConfig: $$Props["transitionConfig"] = {
    duration: 150,
    easing: cubicOut
  };
  export { className as class };

  export let onHide = () => {};

  let el: HTMLDivElement;

  function overlayClick(evt: MouseEvent) {
    onHide();
  }

  $: {
    if (el) {
      el.addEventListener("click", overlayClick);
    }
  }
</script>

<AlertDialogPrimitive.Overlay
  bind:el
  {transition}
  {transitionConfig}
  class={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ", className)}
  {...$$restProps}
/>
