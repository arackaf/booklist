<script lang="ts">
  import { query } from "micro-graphql-svelte";

  import { appState } from "app/state/appState";
  import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
  import type { Queries, QueryOf } from "graphql-typings";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import SectionLoading from "app/components/ui/SectionLoading.svelte";

  import EditPublicUserSettings from "./EditPublicUserSettings.svelte";

  $: ({ online } = $appState);

  const { queryState, sync } = query<QueryOf<Queries["getUser"]>>(PublicUserSettingsQuery, { initialSearch: {} });
  $: ({ loaded, data } = $queryState);
</script>

<div>
  <FlexRow>
    <div class="col-md-6 col-sm-12" style="position: relative; min-height: 200px">
      {#if !loaded}
        <SectionLoading />
      {:else}
        <EditPublicUserSettings settings={data.getUser.User} />
      {/if}
    </div>
  </FlexRow>
</div>
