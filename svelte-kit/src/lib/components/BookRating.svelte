<script lang="ts">
  import Star from "./Star.svelte";
  import { Star as LucideStar } from "lucide-svelte";
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

  type StarProps = {
    class?: string;
    pathClass?: string;
    mask?: string;
  };
</script>

{#snippet partialStar(width)}
  <div class="grid grid-cols-1 grid-rows-1">
    <Star class="col-start-1 col-end-2 row-start-1 row-end-2" />
    <Star class="col-start-1 col-end-2 row-start-1 row-end-2" filled={true} mask={`url(#star-mask-${maskId})`}>
      <defs>
        <mask id="star-mask-{maskId}">
          <rect x="2.5" y="0" width={19 * width} height="24" fill="white" />
        </mask>
      </defs>
    </Star>
  </div>
{/snippet}

{#if averageReview && numberReviews}
  <div class="inline-flex items-center gap-0 [&>:not(:last-child)]:mr-[-2px]">
    <!-- <LucideStar>
      <defs>
        <mask id="star-mask-{maskId}">
          <rect x="0" y="0" width={24 * 0.2} height="24" fill="white" />
        </mask>
      </defs>
    </LucideStar> -->
    {#each Array.from({ length: fullStars })}
      <Star filled={true} />
    {/each}
    {#if partialStarWidth}
      {@render partialStar(partialStarWidth)}
    {/if}
    {#each Array.from({ length: emptyStars })}
      <Star />
    {/each}
  </div>
{/if}
