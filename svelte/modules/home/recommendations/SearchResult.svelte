<script lang="ts">
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  export let book;
  export let selected;
  export let dispatch;
  let adding = false;

  const selectBook = () => {
    adding = true;
    dispatch(["selectBook", book]);
  };
</script>

<li style="overflow: hidden">
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
