<script lang="ts">
  import type { DynamoUser } from "$data/types";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";

  import EditPublicUserSettings from "./EditPublicUserSettings.svelte";

  export let data: { user: DynamoUser };
  $: ({ user } = data);
</script>

<div>
  <FlexRow>
    <div class="col-md-6 col-sm-12" style="position: relative; min-height: 200px">
      <EditPublicUserSettings {user} />
    </div>
  </FlexRow>
</div>
