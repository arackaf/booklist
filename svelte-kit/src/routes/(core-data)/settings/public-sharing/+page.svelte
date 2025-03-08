<script lang="ts">
  import { CircleAlertIcon } from "lucide-svelte";

  import * as Alert from "$lib/components/ui/alert";
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
        <Alert.Root variant="destructive">
          <CircleAlertIcon class="size-4" />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>An error occured</Alert.Description>
        </Alert.Root>
      {/if}
    </div>
  </div>
</div>
