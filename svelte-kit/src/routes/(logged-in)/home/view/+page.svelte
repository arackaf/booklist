<script lang="ts">
  import "./d3-styles.scss";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "$lib/components/layout/tabs/index";

  //import { graphqlClient } from "util/graphql";
  //import { clearCache } from "util/graphqlCacheHelpers";

  import BooksCharts from "./data-vis/BooksCharts.svelte";
  //import BookRecommendations from "./recommendations/BookRecommendations.svelte";
  //import RecentScanResults from "./recent-scans/RecentScanResults.svelte";

  //import barCharQuery from "gql/home/barChart.graphql";

  // graphqlClient.subscribeMutation(
  //   [/(create|update|delete)Subjects?/, /(create|update|delete)Books?/].map(when => ({ when, run: () => clearCache(barCharQuery) }))
  // );
</script>

<BooksCharts />
