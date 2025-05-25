<script lang="ts">
  import { Dialog as DialogPrimitive, type WithoutChildrenOrChild } from "bits-ui";
  import X from "lucide-svelte/icons/x";
  import type { Snippet } from "svelte";
  import * as Dialog from "./index.js";
  import { cn } from "$lib/utils.js";

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: DialogPrimitive.PortalProps;
    children: Snippet;
  } = $props();
</script>

<Dialog.Portal {...portalProps}>
  <Dialog.Overlay class="bg-black/60" />
  <DialogPrimitive.Content
    bind:ref
    class={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 !slide-in-from-left-[-50%] data-[state=open]:zoom-in-95 bg-background fixed left-[50%] top-[50%] z-50 grid max-h-[calc(100dvh-64px)] sm:max-h-[calc(100vh-100px)] max-w-[min(95vw,600px)] w-[min(95vw,600px)] !-translate-x-1/2 gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
      className
    )}
    {...restProps}
  >
    {@render children?.()}
  </DialogPrimitive.Content>
</Dialog.Portal>
