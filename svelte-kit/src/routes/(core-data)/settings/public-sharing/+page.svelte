<script lang="ts">
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
        <div class="alert alert-danger">An error occured</div>
      {/if}
    </div>
  </div>
</div>
