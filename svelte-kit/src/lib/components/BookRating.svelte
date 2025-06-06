<script lang="ts">
  import { Star } from "lucide-svelte";

  type Props = {
    averageReview: string;
    numberReviews: number;
  };

  let { averageReview: _averageReview, numberReviews }: Props = $props();

  const averageReview = $derived(parseFloat(_averageReview));
  const fullStars = $derived(Math.floor(averageReview));
  const partialStarWidth = $derived(averageReview - fullStars);
  const emptyStars = $derived(5 - fullStars - (partialStarWidth > 0 ? 1 : 0));
</script>

{#snippet emptyStar(class)}
  <Star class="w-4 h-4 stroke-[#FF631A] stroke-1 {class}" />
{/snippet}

{#snippet fullStar(class)}
  <Star class="w-4 h-4 fill-[#FF631A] stroke-[#FF631A] stroke-1 {class}" />
{/snippet}

{#snippet partialStar(width)}
  <div class="grid grid-cols-1 grid-rows-1">
    {@render emptyStar("col-start-1 col-end-2 row-start-1 row-end-2")}
    <div class="col-start-1 col-end-2 row-start-1 row-end-2" style="width: {width * 100}%;">
      {@render fullStar()}
    </div>
  </div>
{/snippet}

{#if averageReview && numberReviews}
  <div class="flex items-center gap-0">
    {@render fullStar()}
    {@render fullStar()}
    {@render fullStar()}
    {@render partialStar(partialStarWidth)}
    {@render emptyStar()}
  </div>
{/if}
