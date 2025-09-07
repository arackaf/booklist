<script lang="ts">
  import { ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { type Snippet } from "svelte";

  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";

  type Props = {
    options: () => any[];
    placeholder?: string;
    search?: string;
    onItemSelected: (option: any) => void;
    size?: "sm" | "default";
    triggerClasses?: string;
    renderPlaceholder?: Snippet;
    disabled?: boolean;
    popoverClass?: string;
  };

  let {
    options,
    placeholder,
    search = $bindable(""),
    onItemSelected,
    size = "default",
    triggerClasses = "",
    renderPlaceholder,
    disabled,
    popoverClass = ""
  }: Props = $props();

  let open = $state(false);

  function closeAnimationEnd() {
    if (!open) {
      search = "";
    }
  }

  let popoverTriggerRef = $state<HTMLButtonElement | null>(null);
  let popoverContentRef = $state<HTMLDivElement | null>(null);
  let popoverDirection = $state<"bottom" | "top">("bottom");

  function updatePopoverDirection() {
    if (!popoverTriggerRef || !popoverContentRef || !open) {
      return;
    }

    const triggerBottom = popoverTriggerRef.getBoundingClientRect().bottom;
    const height = window.innerHeight;
    const deltaBottom = height - triggerBottom;
    const deltaTop = popoverTriggerRef.getBoundingClientRect().top;
    const contentHeight = popoverContentRef?.offsetHeight;

    if (deltaBottom > contentHeight) {
      popoverDirection = "bottom";
    } else {
      popoverDirection = deltaTop > deltaBottom ? "top" : "bottom";
    }
  }

  $effect(() => {
    window.addEventListener("scroll", updatePopoverDirection, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", updatePopoverDirection, { capture: true });
    };
  });

  $effect(updatePopoverDirection);
</script>

<Popover.Root {open} onOpenChange={newVal => (open = newVal)}>
  <Popover.Trigger {disabled}>
    {#snippet child({ props })}
      <Button
        bind:ref={popoverTriggerRef}
        size="sm"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        class="w-[150px] justify-between border rounded font-normal
          {size === 'sm' ? 'h-8' : ''}
          {triggerClasses}   
          {disabled ? ' cursor-not-allowed ' : ''}"
        {disabled}
        {...props}
      >
        {#if renderPlaceholder}
          {@render renderPlaceholder()}
        {:else}
          {placeholder ?? "Select"}
        {/if}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>

  <Popover.Content
    bind:ref={popoverContentRef}
    avoidCollisions={false}
    side={popoverDirection}
    class="w-[200px] p-0 {popoverClass}"
    onanimationend={closeAnimationEnd}
  >
    <div>
      <Command.Root shouldFilter={false}>
        <Command.Input bind:value={search} placeholder="Search" />
        <Command.Empty class="h-[31px] py-1 flex items-center">
          <span class="mx-auto">Nothing to select</span>
        </Command.Empty>
        <Command.Group class="max-h-72 overflow-auto">
          {#each options() as option (option.id)}
            <Command.Item
              disabled={option.disabled}
              value={option.id + ""}
              onclick={evt => {
                const item = options().find(opt => opt.id == option.id);
                if (item) {
                  onItemSelected(item);
                }
                if (!evt.metaKey) {
                  open = false;
                }
              }}
            >
              <GenericLabelDisplayItem item={option} />
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.Root>
    </div>
  </Popover.Content>
</Popover.Root>
