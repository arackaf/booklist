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
</script>

<Popover.Root {open} onOpenChange={newVal => (open = newVal)}>
  <Popover.Trigger {disabled}>
    {#snippet child({ props })}
      <Button
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

  <Popover.Content align="start" side="bottom" class="w-[200px] p-0 {popoverClass}" onanimationend={closeAnimationEnd}>
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
