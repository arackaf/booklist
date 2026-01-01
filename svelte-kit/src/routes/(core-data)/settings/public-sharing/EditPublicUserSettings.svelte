<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import type { userInfo } from "$data/drizzle-schema";

  import { type InferSelectModel } from "drizzle-orm";

  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import { cn } from "$lib/utils";

  type Props = {
    user: InferSelectModel<typeof userInfo>;
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
        <Separator class="my-4 h-[2px]" />
      </div>
    {/if}

    <div class="flex items-center gap-2">
      <Checkbox id="share-collection-publicly" name="isPublic" value="true" disabled={saving} bind:checked={showForm} />
      <Label for="share-collection-publicly" class="checkbox">Allow your book collection to be viewed publicly?</Label>
    </div>

    <div style="margin-left: 20px">
      <div class="flex flex-col gap-4">
        {#if showForm}
          <div class="flex flex-col gap-1.5">
            <Label for="input-display-name">Publicly display your name as</Label>
            <Input
              id="input-display-name"
              class={cn("focus:border-border", {
                "border-red-600": error,
                "focus-visible:ring-red-600": error
              })}
              name="publicName"
              value={publicName}
              onchange={nameChange}
              disabled={saving}
              placeholder="Name"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="collection-display-value">Publicly display your collection as</Label>
            <Input id="collection-display-value" name="publicBooksHeader" value={publicBooksHeader} disabled={saving} placeholder="Header" />
          </div>
        {/if}
        <div>
          <Button type="submit" disabled={saving}>Save</Button>
        </div>
      </div>
    </div>
  </div>
</form>
