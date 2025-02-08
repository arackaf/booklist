<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive, type WithoutChild } from "bits-ui";
  import AlertDialogOverlay from "./alert-dialog-overlay.svelte";
  import { cn } from "$lib/utils.js";
  import { fade, scale } from "svelte/transition";

  let {
    ref = $bindable(null),
    class: className,
    children,
    portalProps,
    ...restProps
  }: WithoutChild<AlertDialogPrimitive.ContentProps> & {
    portalProps?: AlertDialogPrimitive.PortalProps;
  } = $props();
</script>

<AlertDialogPrimitive.Portal {...portalProps}>
  <AlertDialogOverlay forceMount>
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:fade={{ duration: 200 }}></div>
      {/if}
    {/snippet}
  </AlertDialogOverlay>
  <AlertDialogPrimitive.Content
    bind:ref
    class={cn(
      "z-50 max-h-[calc(100vh-100px)] w-[min(95vw,600px)] sm:w-[600px] overflow-auto",
      "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
      className
    )}
    {...restProps}
    forceMount
  >
    {#snippet child({ props, open })}
      {#if open}
        <div {...props} transition:scale={{ start: 0.95, duration: 200, opacity: 0 }}>{@render children!()}</div>
      {/if}
    {/snippet}
  </AlertDialogPrimitive.Content>
</AlertDialogPrimitive.Portal>
