<script lang="ts">
  import "./d3-styles.scss";

  import { fade } from "svelte/transition";
  import { quadOut } from "svelte/easing";

  import Tabs from "app/components/layout/tabs/Tabs.svelte";
  import TabHeaders from "app/components/layout/tabs/TabHeaders.svelte";
  import TabHeader from "app/components/layout/tabs/TabHeader.svelte";
  import TabContents from "app/components/layout/tabs/TabContents.svelte";
  import TabContent from "app/components/layout/tabs/TabContent.svelte";
  import { graphqlClient } from "util/graphql";
  import { clearCache } from "util/graphqlCacheHelpers";

  import BooksCharts from "./dataVis/BooksCharts.svelte";
  import BookRecommendations from "./recommendations/BookRecommendations.svelte";
  import RecentScanResults from "./recent-scans/RecentScanResults.svelte";

  import barCharQuery from "graphQL/home/barChart.graphql";

  graphqlClient.subscribeMutation(
    [/(create|update|delete)Subjects?/, /(create|update|delete)Books?/].map(when => ({ when, run: () => clearCache(barCharQuery) }))
  );
</script>

<div transition:fade={{ duration: 150, easing: quadOut }} style="margin-left: auto; margin-right: auto; max-width: 1200px">
  <div>
    <div class="panel-body" style="position: relative">
      <Tabs defaultTab="vis" localStorageName="home-tabs">
        <TabHeaders>
          <TabHeader tabName="vis"><a> <i class="far fa-chart-bar" /> View </a></TabHeader>
          <TabHeader tabName="rec"><a> <span>Discover books</span> </a></TabHeader>
          <TabHeader tabName="recent-scans"><a> <span>Recent scan results</span> </a></TabHeader>
        </TabHeaders>
        <TabContents>
          <TabContent let:isActive tabName="vis">
            {#if isActive}
              <BooksCharts />
            {/if}
          </TabContent>

          <TabContent tabName="rec">
            <BookRecommendations />
          </TabContent>
          <TabContent tabName="recent-scans">
            <RecentScanResults />
          </TabContent>
        </TabContents>
      </Tabs>
    </div>
  </div>
</div>
