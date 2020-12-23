<script lang="ts">
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import { onMount } from "svelte";

  export let book;
  export let dispatch;

  let ref;
</script>

<div style="overflow: hidden">
  <div bind:this={ref}>
    <FlowItems>
      <div><button on:click={() => dispatch(['deSelectBook', book])} style="cursor: pointer" class="btn btn-xs btn-danger"> Remove </button></div>
      <div style="min-width: 70px">
        <CoverSmall url={book.smallImage} />
      </div>
      <div style="flex: 1">
        <div>{book.title}</div>
        {#if book.authors && book.authors.length}<span style="font-style: italic">{book.authors.join(', ')}</span>{/if}
      </div>
    </FlowItems>
    <hr />
  </div>
</div>
