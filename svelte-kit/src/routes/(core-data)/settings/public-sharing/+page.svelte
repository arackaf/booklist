<script lang="ts">
  import FlexRow from "$lib/components/layout/FlexRow.svelte";

  import EditPublicUserSettings from "./EditPublicUserSettings.svelte";

  export let data;
  $: ({ user } = data);
</script>

<div>
  <FlexRow>
    <div class="col-md-6 col-sm-12" style="position: relative; min-height: 200px">
      {#if user}
        <EditPublicUserSettings {user} />
      {:else}
        <div class="alert alert-danger">An error occured</div>
      {/if}
    </div>
  </FlexRow>
</div>
