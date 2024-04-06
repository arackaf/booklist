<script lang="ts">
  import { ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { tick } from "svelte";

  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";

  export let options: () => any[];
  export let placeholder = "";
  export let inputProps = { class: "md:text-sm text-base leading-5" };
  export let search = "";
  export let onItemSelected: (option: any) => void;

  export let size: "sm" | "default" = "default";
  export let triggerClasses = "";

  let inputPropsToUse: any;

  $: {
    inputPropsToUse = inputProps;
    if (!inputPropsToUse.class) {
      inputPropsToUse.class = "md:text-sm text-base leading-5";
    }
  }

  let open = false;

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  const portal = typeof document === "object" ? document.body : null;
</script>

<Popover.Root {portal} bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      size="sm"
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[150px] justify-between {size === 'sm' ? 'h-8' : ''} border rounded border-neutral-400 {triggerClasses}"
    >
      <slot name="placeholder">
        {placeholder ?? "Select"}
      </slot>
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
              onSelect={currentValue => {
                const item = options().find(opt => opt.id == currentValue);
                if (item) {
                  onItemSelected(item);
                }
                closeAndFocusTrigger(ids.trigger);
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
