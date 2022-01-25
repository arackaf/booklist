<script lang="ts">
  import { query } from "micro-graphql-svelte";
  import { Queries, QueryOf } from "graphQL/graphql-typings";

  import BookSummaryDisplay from "./BookSummaryDisplay.svelte";

  import SummaryQuery from "graphQL/admin/bookSummaryCoverInfo.graphql";

  import "./styles.scss";

  let missingCoversFilter = true;

  const imgFilter = missingCoversFilter ? "nophoto" : void 0;

  const { queryState, sync } = query<QueryOf<Queries["allBookSummarys"]>>(SummaryQuery);
  $: sync({ smallImage: imgFilter });

  $: ({ loaded, data } = $queryState);
  $: bookSummaries = data?.allBookSummarys?.BookSummarys ?? [];

  const setMissingCoversFilter = evt => (missingCoversFilter = evt.target.checked);
</script>

<div class="book-list">
  <label>
    Books missing covers <input type="checkbox" checked={missingCoversFilter} onChange={setMissingCoversFilter} />
  </label>
  <br />
  <br />
  {#if loaded}
    <div>
      {#each bookSummaries as book}
        <BookSummaryDisplay {book} />
      {/each}
    </div>
  {:else}
    <span>
      Loading ... <i class="far fa-spinner fa-spin" />
    </span>
  {/if}
</div>
