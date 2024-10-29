<script lang="ts">
  import { ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { tick, type Snippet } from "svelte";

  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";
  import { Portal } from "../ui/alert-dialog";

  type Props = {
    options: () => any[];
    placeholder?: string;
    search?: string;
    onItemSelected: (option: any) => void;
    size?: "sm" | "default";
    triggerClasses?: string;
    renderPlaceholder?: Snippet;
  };

  let { options, placeholder, search = $bindable(""), onItemSelected, size = "default", triggerClasses = "", renderPlaceholder }: Props = $props();

  let open = $state(false);
</script>

<Popover.Root {open} onOpenChange={newVal => (open = newVal)}>
  <Popover.Trigger>
    <Button
      size="sm"
      variant="outline"
      role="combobox"
      aria-expanded={true}
      class="w-[150px] justify-between {size === 'sm' ? 'h-8' : ''} border rounded border-neutral-400 {triggerClasses}"
    >
      {#if renderPlaceholder}
        {@render renderPlaceholder()}
      {:else}
        {placeholder ?? "Select"}
      {/if}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>

  <Popover.Content avoidCollisions={false} side="bottom" class="w-[200px] p-0">
    <div class="max-h-72 overflow-auto">
      <Command.Root shouldFilter={false}>
        <Command.Input bind:value={search} placeholder="Search" />
        <Command.Empty>Nothing to select</Command.Empty>
        <Command.Group>
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
