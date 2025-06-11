<script lang="ts">
  import Star from "./Star.svelte";

  type Props = {
    averageReview: string;
    numberReviews: number;
    starSize?: number;
  };

  let { averageReview: _averageReview, numberReviews, starSize }: Props = $props();

  let averageReview = $derived(parseFloat(_averageReview));
  let fullStars = $derived(Math.floor(averageReview));
  let partialStarWidth = $derived(averageReview - fullStars);
  let emptyStars = $derived(5 - fullStars - (partialStarWidth > 0 ? 1 : 0));
</script>

{#if averageReview && numberReviews}
  <div class="inline-flex items-center gap-0 [&>:not(:last-child)]:mr-[-1px]">
    {#each Array.from({ length: fullStars })}
      <Star {starSize} filled={true} />
    {/each}
    {#if partialStarWidth}
      <div class="grid grid-cols-1 grid-rows-1">
        <Star {starSize} class="col-start-1 col-end-2 row-start-1 row-end-2" />
        <Star {starSize} class="col-start-1 col-end-2 row-start-1 row-end-2" filled={true} fillPercentage={partialStarWidth}></Star>
      </div>
    {/if}
    {#each Array.from({ length: emptyStars })}
      <Star {starSize} />
    {/each}
  </div>
{/if}
