<script lang="ts">
  import Star from "./Star.svelte";

  type Props = {
    averageReview: string | number;
    numberReviews: number;
  };

  let { averageReview: _averageReview, numberReviews }: Props = $props();

  let averageReview = $derived(typeof _averageReview === "number" ? _averageReview : parseFloat(_averageReview));
  let fullStars = $derived(Math.floor(averageReview));
  let partialStarWidth = $derived(averageReview - fullStars);
  let emptyStars = $derived(5 - fullStars - (partialStarWidth > 0 ? 1 : 0));
</script>

{#if averageReview && numberReviews}
  <div class="inline-flex items-center gap-0 [&>:not(:last-child)]:mr-[-2px]">
    {#each Array.from({ length: fullStars })}
      <Star filled={true} />
    {/each}
    {#if partialStarWidth}
      <div class="grid grid-cols-1 grid-rows-1">
        <Star class="col-start-1 col-end-2 row-start-1 row-end-2" />
        <Star class="col-start-1 col-end-2 row-start-1 row-end-2" filled={true} fillPercentage={partialStarWidth}></Star>
      </div>
    {/if}
    {#each Array.from({ length: emptyStars })}
      <Star />
    {/each}
  </div>
{/if}
