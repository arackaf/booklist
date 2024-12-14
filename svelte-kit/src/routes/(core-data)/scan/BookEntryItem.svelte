<script lang="ts">
  import { onMount } from "svelte";
  import { ajaxUtil } from "$lib/util/ajaxUtil";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";

  type Props = {
    focused: boolean;
    selected: boolean;
    entryFinished: () => void;
    idx: number;
    onFocus: () => void;
  };

  let { focused, selected, entryFinished, idx }: Props = $props();

  let inputEl = $state<HTMLInputElement | null>(null);
  let queuing = $state(false);
  let queued = $state(false);
  let mounted = $state(false);

  $effect(() => {
    if (focused && inputEl) {
      inputEl.focus();
    }
  });

  $effect(() => {
    if (selected && inputEl) {
      inputEl.select();
    }
  });

  const onFocus = () => {
    if (!focused) {
      onFocus();
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

      const isbn = inputEl?.value;
      if (isbn?.length == 10 || isbn?.length == 13) {
        queuing = true;
        ajaxUtil.post("/api/scan-book", { isbn }, () => {
          queuing = false;
          queued = true;
          setTimeout(() => {
            if (mounted) {
              queued = false;
              if (inputEl) {
                inputEl.value = "";
              }
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
  <Input id="entry-item-{idx}" onfocus={onFocus} style="max-width: 250px" bind:inputEl onkeydown={keyDown} />
  {#if queuing}<Label class="ml-2">Queuing</Label>{/if}
  {#if queued}<Label theme="success" class="ml-2">Queue</Label>{/if}
</div>
