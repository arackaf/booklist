<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";
  import EditPublicUserSettings from "./EditPublicUserSettings.svelte";

  let { data } = $props();
  let { user, isPublic, publicLink } = $derived(data);
</script>

<div>
  <div class="flex flex-row">
    <div class="basis-full lg:basis-1/2" style="position: relative; min-height: 200px">
      {#if user}
        <EditPublicUserSettings {user} {isPublic} {publicLink} />
      {:else}
        <Alert type="error">An error occured</Alert>
      {/if}
    </div>
  </div>
</div>
