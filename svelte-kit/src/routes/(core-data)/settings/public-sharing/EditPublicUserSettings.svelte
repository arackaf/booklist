<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import type { DynamoUser } from "$data/types";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  export let user: DynamoUser;
  export let isPublic: boolean;
  export let publicLink: string;

  let { publicName, publicBooksHeader } = user;

  let showForm = isPublic;
  let error = false;
  let saving = false;

  const update = ({ cancel, data }: { cancel: any; data: FormData }) => {
    const isPublic = !!data.get("isPublic");
    const publicName = data.get("publicName")?.toString();

    if (isPublic && !publicName) {
      error = true;
      return cancel();
    }

    saving = true;
    return async () => {
      saving = false;
      invalidate("user:settings");
    };
  };

  const nameChange = (evt: any) => {
    if (evt.target.value) {
      error = false;
    }
  };
</script>

<form method="post" action="?/updateSettings" use:enhance={update}>
  <div class="flex flex-col gap-4">
    {#if publicLink}
      <div class="flex flex-col">
        <div>
          Your collection is currently public, viewable{" "}
          <a target="_blank" rel="noreferrer" href={publicLink}> here </a>
        </div>
        <hr style="width: 100%" class="mt-2 mb-0" />
      </div>
    {/if}

    <div class="checkbox-group">
      <label class="checkbox">
        Allow your book collection to be viewed publicly?
        <input name="isPublic" bind:checked={showForm} disabled={saving} style="margin-left: 5px" type="checkbox" />
      </label>
    </div>

    <div style="margin-left: 20px">
      <div class="flex flex-col gap-4">
        {#if showForm}
          <div>
            <div class="form-group">
              <label for="public-name">Publicly display your name as</label>
              <input id="public-name" name="publicName" value={publicName} class:error on:change={nameChange} disabled={saving} placeholder="Name" />
            </div>
          </div>
          <div>
            <div class="form-group">
              <label for="public-header">Publicly display your collection as</label>
              <input
                id="public-header"
                name="publicBooksHeader"
                value={publicBooksHeader}
                disabled={saving}
                class="form-control"
                placeholder="Header"
              />
            </div>
          </div>
        {/if}
        <div>
          <ActionButton isRunning={saving} style="min-width: 12ch" text="Save" runningText="Saving" finishedText="Saved" preset="primary" />
        </div>
      </div>
    </div>
  </div>
</form>
