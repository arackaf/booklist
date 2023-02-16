<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import type { DynamoUser } from "$data/types";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  export let user: DynamoUser;

  let { isPublic, publicName, publicBooksHeader, userId } = user;

  let local_isPublic: boolean;
  let local_publicName: string;
  let local_publicBooksHeader: string;

  $: {
    local_isPublic = isPublic;
    local_publicName = publicName;
    local_publicBooksHeader = publicBooksHeader;
  }

  let error = false;
  let saving = false;

  $: {
    if (local_publicName) {
      error = false;
    }
  }

  const update = ({ cancel }: any) => {
    if (local_isPublic && !local_publicName) {
      error = true;
      return cancel();
    }

    saving = true;
    return async () => {
      saving = false;
      invalidate("user:settings");
    };
  };

  $: publicLink = typeof window === "object" && isPublic ? `${window.location.protocol}//${window.location.host}/books?user=${userId}` : "";
</script>

<form method="post" action="?/updateSettings" use:enhance={update}>
  <Stack looser={true}>
    {#if publicLink}
      <div>
        Your collection is currently public, viewable{" "}
        <a target="_blank" rel="noreferrer" href={publicLink}> here </a>
      </div>
    {/if}

    <hr style="width: 100%" />

    <div class="checkbox-group">
      <label class="checkbox">
        Allow your book collection to be viewed publicly?
        <input name="isPublic" bind:checked={local_isPublic} disabled={saving} style="margin-left: 5px" type="checkbox" />
      </label>
    </div>

    <div style="margin-left: 20px">
      <FlexRow>
        {#if local_isPublic}
          <div class="col-xs-12">
            <div class="form-group">
              <label for="public-name">Publicly display your name as</label>
              <input id="public-name" name="publicName" class:error bind:value={local_publicName} disabled={saving} placeholder="Public name" />
            </div>
          </div>
          <div class="col-xs-12">
            <div class="form-group">
              <label for="public-header">Publicly display your collection as</label>
              <input
                id="public-header"
                name="publicBooksHeader"
                bind:value={local_publicBooksHeader}
                disabled={saving}
                class="form-control"
                placeholder="Book header"
              />
            </div>
          </div>
        {/if}
        <div class="col-xs-12">
          <ActionButton isRunning={saving} style="min-width: 12ch" text="Save" runningText="Saving" finishedText="Saved" preset="primary" />
        </div>
      </FlexRow>
    </div>
  </Stack>
</form>
