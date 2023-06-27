<script lang="ts">
  import { signOut } from "@auth/sveltekit/client";

  import { enhance } from "$app/forms";

  import Alert from "$lib/components/ui/Alert.svelte";
  import ActionButton from "$lib/components/ui/Button/ActionButton.svelte";
  import { invalidateAll } from "$app/navigation";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";

  export let data;

  $: ({ legacySync } = data);

  let running = false;
  let notFound = false;
  let success = false;

  const execute = () => {
    running = true;
    success = notFound = false;

    return async ({ result }: any) => {
      running = false;
      if (result.data.success) {
        success = true;
        setTimeout(() => signOut().then(() => invalidateAll()), 5000);
      } else {
        notFound = true;
      }
    };
  };
</script>

<form method="post" action="?/attemptSync" use:enhance={execute}>
  <div class="flex flex-row">
    <div class="basis-full lg:basis-1/2">
      <div class="flex flex-col gap-4">
        {#if legacySync}
          <Alert type="info">You've already sync'd your account</Alert>
        {:else if success}
          <Alert type="success">Your account is now sync'd. You'll be logged out in a few moments. Log back in to see your books.</Alert>
        {:else}
          <Alert type="info">
            If you had an account with the old version of this site, with an email/password, your books are safe, where you left them
            <br />
            <br />
            Just enter your email address and password, and your current account will become sync'd with your old one
          </Alert>
          <InputGroup labelText="Email">
            <Input slot="input" name="email" />
          </InputGroup>

          <InputGroup labelText="New password">
            <Input slot="input" type="password" name="password" />
          </InputGroup>

          <ActionButton class="self-start" {running} theme="primary">Sync</ActionButton>
        {/if}

        {#if notFound}
          <div>
            <br />
            <Alert type="error">Could not find an account with that email and password</Alert>
          </div>
        {/if}
      </div>
    </div>
  </div>
</form>
