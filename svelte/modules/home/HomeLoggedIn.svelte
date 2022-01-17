<script lang="ts">
  import "./d3-styles.scss";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "app/components/layout/tabs/index";

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

<div style="margin-left: auto; margin-right: auto; max-width: 1200px">
  <div>
    <div class="panel-body" style="position: relative">
      <Tabs defaultTab="vis" localStorageName="home-tabs">
        <TabHeaders>
          <TabHeader tabName="vis" spaceWith="VIEW...."><a> <i class="far fa-chart-bar" /> View </a></TabHeader>
          <TabHeader tabName="rec" text="Discover books" />
          <TabHeader tabName="recent-scans" text="Recent scans" />
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
