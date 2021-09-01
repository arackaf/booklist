<script context="module">
  function scanReducer(state, [type, payload]) {
    switch (type) {
      case "pendingCountSet":
      case "bookQueued":
        return { ...state, pending: payload };
      case "scanResults":
        const newItems = payload.results.map(result => ({ success: result.success, ...result.item }));
        return { ...state, booksSaved: newItems.concat(state.booksSaved).slice(0, 25) };
    }
    return state;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { quadIn } from "svelte/easing";

  import slideAnimate from "app/animationHelpers";
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import useReducer from "util/useReducer";
  import { preloadNewBookImage } from "util/imagePreload";

  type StateType = { pending: any; booksSaved: any[] };
  let [state, dispatch] = useReducer<StateType>(scanReducer, { pending: 0, booksSaved: [] });
  $: ({ pending, booksSaved } = $state);

  let showIncomingQueue = false;
  const toggleIncomingQueue = () => (showIncomingQueue = !showIncomingQueue);

  $: toggleClass = showIncomingQueue ? "fa-angle-double-up" : "fa-angle-double-down";

  onMount(() => {
    function sendIt({ detail }: any) {
      if (detail.type == "scanResults") {
        const successfulBooksWithImages = detail.packet.results.filter(result => result.success && result.item.smallImage);
        Promise.all(successfulBooksWithImages.map(result => preloadNewBookImage(result.item))).then(() => {
          dispatch([detail.type, detail.pendingCount ?? detail.packet]);
        });
      } else {
        dispatch([detail.type, detail.pendingCount ?? detail.packet]);
      }
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
        {pending}
        Book{pending === 1 ? "" : "s"}
        currently outstanding
        {#if booksSaved.length || pending}
          <a on:click={toggleIncomingQueue} class="margin-left-xs"> <i style="color: white" class="fa fa-white {toggleClass}" /> </a>
        {/if}
      </span>
    {:else if pending != null}
      <span class="label label-success"
        >All pending books saved
        {#if booksSaved.length || pending}
          <a on:click={toggleIncomingQueue} class="margin-left-xs"> <i style="color: white" class="fa fa-white {toggleClass}" /> </a>
        {/if}</span
      >
    {/if}
  </div>

  <div style="margin-top: 10px">
    <div use:slideAnimate={{ open: showIncomingQueue, fade: true, stiffDown: true }}>
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
                <CoverSmall url={book.smallImage} />
              </div>
              <span>{book.title}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
