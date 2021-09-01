<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import ajaxUtil from "util/ajaxUtil";
  import { getLoginStatus } from "util/loginStatus";

  export let focused;
  export let selected;
  export let entryFinished;

  let inputEl;
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

  const keyDown = evt => {
    if (evt.keyCode == 13) {
      entryFinished();

      const isbn = inputEl.value;
      if (isbn.length == 10 || isbn.length == 13) {
        queuing = true;
        Promise.resolve(ajaxUtil.postWithCors(process.env.SCAN_BOOK, { isbn, ...getLoginStatus() })).then(() => {
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
  <div><label class="control-label" style="margin-right: 5px"> ISBN </label></div>
  <input on:focus={onFocus} style="max-width: 250px" class="form-control" bind:this={inputEl} on:keydown={keyDown} />
  {#if queuing}<span class="label label-default margin-left">Queuing</span>{/if}
  {#if queued}<span class="label label-success margin-left">Queued</span>{/if}
</div>
