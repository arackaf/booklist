<script lang="ts">
  import { getContext } from "svelte";
  import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";

  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  let numberAnimating = 0;
  const modalContext: any = getContext("svelte-helpers-modal");

  export let book;
  export let dispatch;
  let adding = false;

  const selectBook = () => {
    adding = true;
    ++numberAnimating;
    dispatch(["selectBook", book]);
  };

  const slideOut: any = node => {
    let height = node.offsetHeight;
    return adding
      ? {
          duration: 200,
          css: t => `opacity: ${quadIn(t)}; height: ${t * height}px; transform: translateX(${quadIn(1 - t) * 90}%)`
        }
      : null;
  };

  const leaving = () => modalContext.isAnimatingResizing.set(!numberAnimating);
  const left = () => adding && setTimeout(() => modalContext.isAnimatingResizing.set(!--numberAnimating), 1);
</script>

<li on:outrostart={leaving} on:outroend={left} out:slideOut style="overflow: hidden">
  <div>
    <Stack>
      <FlowItems>
        <div style="min-width: 70px">
          <CoverSmall url={book.smallImage} />
        </div>

        <Stack style="flex: 1; justify-content: space-between">
          <div>
            <div>{book.title}</div>
            {#if book.authors && book.authors.length}
              <div style="font-style: italic; font-size: 14px">{book.authors.join(', ')}</div>
            {/if}
          </div>
          <button
            disabled={adding}
            on:click={selectBook}
            style="cursor: pointer; margin-top: auto; align-self: flex-start"
            class="btn btn-primary btn-xs"
          >
            Add to list&nbsp;
            <i class="fal fa-plus" />
          </button>
        </Stack>
      </FlowItems>
      <hr />
    </Stack>
  </div>
</li>
