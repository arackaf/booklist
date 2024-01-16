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
      "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50",
      "w-[min(95vw,600px)] sm:w-[600px]",
      "grid gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
      className
    )}
    {...$$restProps}
  >
    <slot />
  </AlertDialogPrimitive.Content>
</AlertDialog.Portal>
