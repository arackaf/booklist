<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { quadIn } from "svelte/easing";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import useReducer from "$lib/state/useReducer";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";

  function scanReducer(state: any, [type, payload]: any) {
    switch (type) {
      case "pendingCountSet":
      case "bookQueued":
        return { ...state, pending: payload };
      case "scanResults":
        const newItems = payload.results.map((result: any) => ({ success: result.success, ...result.item }));
        return { ...state, booksSaved: newItems.concat(state.booksSaved).slice(0, 25) };
    }
    return state;
  }

  type StateType = { pending: any; booksSaved: any[] };
  let [state, dispatch] = useReducer<StateType>(scanReducer, { pending: 0, booksSaved: [] });
  $: ({ pending, booksSaved } = $state);

  let showIncomingQueue = false;
  const toggleIncomingQueue = () => (showIncomingQueue = !showIncomingQueue);

  $: toggleClass = showIncomingQueue ? "fa-angle-double-up" : "fa-angle-double-down";

  $: toggleShow = booksSaved.length || pending;
  $: labelScanStatusStyles = !!toggleShow ? `display: inline-block; width: 30ch` : "";

  onMount(() => {
    function sendIt({ detail }: any) {
      dispatch([detail.type, detail.pendingCount ?? detail.packet]);
    }

    window.addEventListener("ws-info", sendIt);
    window.dispatchEvent(new CustomEvent("sync-ws"));

    return () => window.removeEventListener("ws-info", sendIt);
  });
</script>

<div style="flex: 1">
  <div>
    {#if pending}
      <span class="label label-info">
        <span style={labelScanStatusStyles}>
          {pending}
          Book{pending === 1 ? "" : "s"}
          currently outstanding
        </span>
        {#if toggleShow}
          <button on:click={toggleIncomingQueue} class="raw-button margin-left-xs">
            <i style="color: white" class="far fa-white {toggleClass}" />
          </button>
        {/if}
      </span>
    {:else if pending != null}
      <span class="label label-success">
        <span style={labelScanStatusStyles}> All pending books saved </span>
        {#if toggleShow}
          <button on:click={toggleIncomingQueue} class="margin-left-xs">
            <i style="color: white" class="far fa-white {toggleClass}" />
          </button>
        {/if}
      </span>
    {/if}
  </div>

  <div style="margin-top: 10px">
    <SlideAnimate open={showIncomingQueue} stiffDown={true}>
      <div class="alert alert-info alert-slim" style="margin-bottom: 15px">
        Your entered and failed books will show up here, briefly, although everything is being logged. Eventually there'll be a dedicated place to see
        what's been saved, and what failed to be found.
      </div>

      <div style="margin-bottom: 0">
        {#each booksSaved as book (book)}
          <div transition:fade|local={{ easing: quadIn }} class="margin-bottom">
            <div
              class="border-bottom padding-bottom"
              style="display: flex; flex-direction: row; color: {book.success ? 'var(--neutral-text)' : 'red'}"
            >
              <div style="min-width: 90px">
                <BookCover size="small" url={book.smallImage} />
              </div>
              <span>{book.title}</span>
            </div>
          </div>
        {/each}
      </div>
    </SlideAnimate>
  </div>
</div>
