<script lang="ts">
  import { mutation } from "micro-graphql-svelte";
  import type { MutationOf, Mutations, User } from "graphql-typings";

  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import { appState } from "app/state/appState";

  import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
  import UpdatePublisUserSettingsMutation from "graphQL/settings/updatePublicUserSettings.graphql";
  import { clearCache } from "util/graphqlCacheHelpers";

  export let settings: User;

  const { mutationState } = mutation<MutationOf<Mutations["updateUser"]>>(UpdatePublisUserSettingsMutation);
  $: ({ runMutation, running: saving } = $mutationState);

  let { publicBooksHeader, publicName, isPublic } = settings;
  let currentlyPublic = isPublic;

  let validating = false;

  const update = evt => {
    evt.preventDefault();

    if (!publicName) {
      validating = true;
    }
    runMutation({
      isPublic,
      publicBooksHeader: publicBooksHeader || "",
      publicName: publicName || ""
    }).then(() => {
      clearCache(PublicUserSettingsQuery);
    });
  };

  $: publicLink = currentlyPublic ? `http://${window.location.host}/view?userId=${$appState.userId}` : "";
</script>

<Stack looser={true}>
  {#if publicLink}
    <div>
      Your collection is currently public, viewable{" "}
      <a target="_blank" href={publicLink}> here </a>
    </div>
  {/if}

  <hr style="width: 100%" />

  <div class="checkbox-group">
    <label class="checkbox">
      Allow your book collection to be viewed publicly?
      <input bind:checked={isPublic} disabled={saving} style="margin-left: 5px" type="checkbox" />
    </label>
  </div>

  <div style="margin-left: 20px">
    <form on:submit={update}>
      <FlexRow>
        {#if isPublic}
          <div class="col-xs-12">
            <div class="form-group">
              <label>Publicly display your name as</label>
              <input class:error={validating && !publicName} bind:value={publicName} disabled={saving} placeholder="Public name" />
            </div>
          </div>
          <div class="col-xs-12">
            <div class="form-group">
              <label>Publicly display your collection as</label>
              <input bind:value={publicBooksHeader} disabled={saving} class="form-control" placeholder="Book header" />
            </div>
          </div>
        {/if}
        <div class="col-xs-12">
          <ActionButton
            isRunning={saving}
            onClick={update}
            type="submit"
            style="min-width: 12ch"
            text="Save"
            runningText="Saving"
            finishedText="Saved"
            preset="primary"
          />
        </div>
      </FlexRow>
    </form>
  </div>
</Stack>
