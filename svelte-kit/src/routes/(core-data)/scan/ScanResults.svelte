<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { quadIn } from "svelte/easing";

  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
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

  onMount(() => {
    function sendIt({ detail }: any) {
      dispatch([detail.type, detail.pendingCount ?? detail.packet]);
    }

    window.addEventListener("ws-info", sendIt);
    window.dispatchEvent(new CustomEvent("sync-ws"));

    return () => window.removeEventListener("ws-info", sendIt);
  });
</script>

<div>
  <div>
    {#if pending}
      <Button size="sm" theme="info" on:click={toggleIncomingQueue}>
        <span>
          {pending}
          Book{pending === 1 ? "" : "s"}
          currently outstanding
          <i class="far ml-1 {toggleClass}" />
        </span>
      </Button>
    {:else}
      <Button size="sm" class="gap-2" on:click={toggleIncomingQueue} theme="success">
        <span> All pending books saved </span>
        <i style="color: white" class="far fa-white {toggleClass}" />
      </Button>
    {/if}
  </div>

  <div style="margin-top: 10px">
    <SlideAnimate open={showIncomingQueue} stiffDown={true}>
      <Alert type="info" layout="slim" class="mb-4">
        Your entered and failed books will show up here, briefly, although everything is being logged. The recent scans section in the main page has
        all recent scan results.
      </Alert>

      <div style="margin-bottom: 0">
        {#each booksSaved as book (book)}
          <div transition:fade|local={{ easing: quadIn }} class="mb-2">
            <div class="border-bottom pb-2" style="display: flex; flex-direction: row; color: {book.success ? 'var(--neutral-3)' : 'red'}">
              <div style="min-width: 90px">
                <BookCover size="small" {book} />
              </div>
              <span>{book.title}</span>
            </div>
          </div>
        {/each}
      </div>
    </SlideAnimate>
  </div>
</div>
