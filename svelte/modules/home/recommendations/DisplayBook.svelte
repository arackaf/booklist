<script lang="ts">
  import { springIn } from "svelte-helpers/spring-transitions";

  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import { onMount } from "svelte";
  import { quadIn, quadOut } from "svelte/easing";

  export let book;
  export let dispatch;

  const SLIDE_IN_SPRING = { stiffness: 0.1, damping: 0.4 };

  const slideIn: any = node => {
    const { duration, tickToValue } = springIn(-25, 0, SLIDE_IN_SPRING);
    return {
      duration: duration,
      css: t => `opacity: ${quadOut(t)}; transform: translateX(${tickToValue(t)}%)`
    };
  };
  const slideOut: any = node => {
    let height = node.offsetHeight;
    return {
      duration: 200,
      css: t => `opacity: ${quadIn(t)}; height: ${t * height}px; transform: translateX(${quadIn(1 - t) * 90}%)`
    };
  };

  let ref;
</script>

<div style="overflow: hidden">
  <div bind:this={ref} in:slideIn|local out:slideOut|local>
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
