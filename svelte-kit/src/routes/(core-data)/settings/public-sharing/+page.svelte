<script lang="ts">
  import Alert from "$lib/components/ui/Alert.svelte";
  import EditPublicUserSettings from "./EditPublicUserSettings.svelte";

  export let data;
  $: ({ user, isPublic, publicLink } = data);
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
