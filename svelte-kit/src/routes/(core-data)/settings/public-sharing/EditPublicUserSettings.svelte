<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import type { DynamoUser } from "$data/types";

  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import InputGroup from "$lib/components/form-elements/Input/InputGroup.svelte";

  type Props = {
    user: DynamoUser;
    isPublic: boolean;
    publicLink: string;
  };

  let { user, isPublic, publicLink }: Props = $props();
  let { publicName, publicBooksHeader } = $derived(user);

  let showForm = $state(isPublic);
  let error = $state(false);
  let saving = $state(false);

  const update = ({ cancel, formData: data }: { cancel: any; formData: FormData }) => {
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

    <div class="flex font-bold text-sm">
      <label class="checkbox">
        Allow your book collection to be viewed publicly?
        <input name="isPublic" bind:checked={showForm} disabled={saving} style="margin-left: 5px" type="checkbox" />
      </label>
    </div>

    <div style="margin-left: 20px">
      <div class="flex flex-col gap-4">
        {#if showForm}
          <InputGroup labelText="Publicly display your name as">
            <Input slot="input" name="publicName" value={publicName} {error} onchange={nameChange} disabled={saving} placeholder="Name" />
          </InputGroup>

          <InputGroup labelText="Publicly display your collection as">
            <Input slot="input" name="publicBooksHeader" value={publicBooksHeader} disabled={saving} placeholder="Header" />
          </InputGroup>
        {/if}
        <div>
          <ActionButton running={saving} theme="primary">Save</ActionButton>
        </div>
      </div>
    </div>
  </div>
</form>
