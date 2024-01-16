<script lang="ts">
  import { Check, ChevronsUpDown } from "lucide-svelte";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils";
  import { tick } from "svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  import AutoSuggest from "svelte-helpers/AutoSuggest.svelte";
  import GenericLabelDisplayItem from "./GenericLabelDisplayItem.svelte";

  export let options: any;
  export let placeholder = "";
  export let inputProps = { class: "md:text-sm text-base leading-5" };
  export let search = "";
  export let onItemSelected: (option: any, inputEl: HTMLInputElement) => void;
  export let noFiltering = false;

  let className = "";
  export { className as class };

  let inputPropsToUse: any;

  $: {
    inputPropsToUse = inputProps;
    if (!inputPropsToUse.class) {
      inputPropsToUse.class = "md:text-sm text-base leading-5";
    }
  }

  let inputStyles = "width: 100px; border-top-width: 0; border-right-width: 0; border-left-width: 0; border-radius: 0;";

  const frameworks = [
    {
      value: "sveltekit",
      label: "SvelteKit"
    },
    {
      value: "next.js",
      label: "Next.js"
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js"
    },
    {
      value: "remix",
      label: "Remix"
    },
    {
      value: "astro",
      label: "Astro"
    }
  ];
  let open = false;
  let value = "";
  //$: selectedValue = frameworks.find(f => f.value === value)?.name ?? "Select a framework...";
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }

  function trap(evt: MouseEvent) {
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    evt.preventDefault();
  }
</script>

<Popover.Root portal={document.body} bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open} class="w-[200px] justify-between">
      x
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content avoidCollisions={false} side="bottom" class="w-[200px] p-0">
    <div on:click={trap} class="max-h-72 overflow-auto">
      <Command.Root shouldFilter={false}>
        <Command.Input bind:value={search} placeholder="Search framework..." />
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each options() as option (option.id)}
            <Command.Item
              disabled={option.id == 6755}
              value={option.id + ""}
              onSelect={currentValue => {
                console.log(currentValue);
                value = currentValue;
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

<!-- <div class="generic-label-select {className}">
  <AutoSuggest
    keyField="id"
    {options}
    inputProps={inputPropsToUse}
    {placeholder}
    {onItemSelected}
    {inputStyles}
    {noFiltering}
    filterField="name"
    bind:currentSearch={search}
  >
    <span slot="result" let:option>
      <GenericLabelDisplayItem item={option} />
    </span>
  </AutoSuggest>
</div> -->
