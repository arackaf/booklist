<script lang="ts">
  import Tabs from "app/components/layout/tabs/Tabs.svelte";
  import TabHeaders from "app/components/layout/tabs/TabHeaders.svelte";
  import TabHeader from "app/components/layout/tabs/TabHeader.svelte";
  import TabContents from "app/components/layout/tabs/TabContents.svelte";
  import TabContent from "app/components/layout/tabs/TabContent.svelte";
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: 1200px">
    <div className="">
      <div className="panel-body" style="position: relative">
        <Tabs defaultTab="vis" localStorageName="home-tabs">
          <TabHeaders>
            <TabHeader tabName="vis"><a> <i class="far fa-chart-bar" /> View </a></TabHeader>
            <TabHeader tabName="rec"><a> <span>Discover books</span> </a></TabHeader>
          </TabHeaders>
          <TabContents>
            <TabContent tabName="vis">
              <h1>VIS</h1>
            </TabContent>

            <TabContent tabName="rec">
              <h1>REC</h1>
            </TabContent>
          </TabContents>
        </Tabs>
      </div>
    </div>
  </div>
</section>
