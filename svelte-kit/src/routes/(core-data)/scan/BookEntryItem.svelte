<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";

  export let focused: boolean;
  export let selected: boolean;
  export let entryFinished: () => void;
  export let idx: number;

  let inputEl: HTMLInputElement;
  $: {
    focused && inputEl?.focus();
  }
  $: {
    selected && inputEl?.select();
  }

  let dispatch = createEventDispatcher();

  let queuing = false;
  let queued = false;
  let mounted = false;

  const onFocus = () => {
    if (!focused) {
      dispatch("focus");
    }
  };

  onMount(() => {
    mounted = true;
    return () => {
      mounted = false;
    };
  });

  const keyDown = (evt: any) => {
    if (evt.keyCode == 13) {
      entryFinished();

      const isbn = inputEl.value;
      if (isbn.length == 10 || isbn.length == 13) {
        queuing = true;
        ajaxUtil.post("/api/scan-book", { isbn }, () => {
          queuing = false;
          queued = true;
          setTimeout(() => {
            if (mounted) {
              queued = false;
              inputEl.value = "";
            }
          }, 1500);
        });
      }
    }
  };
</script>

<div style="display: flex; align-items: center; margin-bottom: 10px">
  <div>
    <label for="entry-item-{idx}" class="control-label" style="margin-right: 5px"> ISBN </label>
  </div>
  <Input id="entry-item-{idx}" on:focus={onFocus} style="max-width: 250px" bind:inputEl on:keydown={keyDown} />
  {#if queuing}<Label class="ml-2">Queuing</Label>{/if}
  {#if queued}<Label theme="success" class="ml-2">Queue</Label>{/if}
</div>
