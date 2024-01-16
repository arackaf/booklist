<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import * as AlertDialog from ".";
  import { cn, flyAndScale } from "$lib/utils";

  type $$Props = AlertDialogPrimitive.ContentProps;

  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = undefined;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<AlertDialog.Portal>
  <AlertDialog.Overlay class="backdrop-blur-[2px] bg-background/50" />
  <AlertDialogPrimitive.Content
    {transition}
    {transitionConfig}
    class={cn(
      "fixed left-[50%] top-[50px] translate-x-[-50%] z-50 max-h-[calc(100vh-100px)] overflow-auto",
      "w-[min(95vw,600px)] sm:w-[600px]",
      "grid gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
      className
    )}
    {...$$restProps}
  >
    <slot />
  </AlertDialogPrimitive.Content>
</AlertDialog.Portal>
