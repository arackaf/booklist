<script lang="ts">
  import { Star } from "lucide-svelte";
  import { v4 as uuid } from "uuid";

  type Props = {
    averageReview: string | number;
    numberReviews: number;
  };

  let { averageReview: _averageReview, numberReviews }: Props = $props();

  const averageReview = $derived(typeof _averageReview === "number" ? _averageReview : parseFloat(_averageReview));
  const fullStars = $derived(Math.floor(averageReview));
  const partialStarWidth = $derived(averageReview - fullStars);
  const emptyStars = $derived(5 - fullStars - (partialStarWidth > 0 ? 1 : 0));
  const maskId = uuid();
</script>

{#snippet emptyStar(className?: string)}
  <Star class="stroke-[#FF631A] stroke-1 {className}" />
{/snippet}

{#snippet fullStar(className?: string)}
  <Star class=" fill-[#FF631A] stroke-[#FF631A] stroke-0 {className}" />
{/snippet}

{#snippet partialStar(width)}
  <div class="grid grid-cols-1 grid-rows-1">
    {@render emptyStar("col-start-1 col-end-2 row-start-1 row-end-2")}
    <Star class=" fill-[#FF631A] stroke-[#FF631A] stroke-0 [&>path]:[mask:url(#star-mask-{maskId})] col-start-1 col-end-2 row-start-1 row-end-2">
      <defs>
        <mask id="star-mask-{maskId}">
          <rect x="0" y="0" width={24 * width} height="24" fill="white" />
        </mask>
      </defs>
    </Star>
  </div>
{/snippet}

{#if averageReview && numberReviews}
  <div class="inline-flex items-center gap-0 [&>:not(:last-child)]:mr-[-2px]">
    {#each Array.from({ length: fullStars })}
      {@render fullStar()}
    {/each}
    {#if partialStarWidth}
      {@render partialStar(partialStarWidth)}
    {/if}
    {#each Array.from({ length: emptyStars })}
      {@render emptyStar()}
    {/each}
  </div>
{/if}
