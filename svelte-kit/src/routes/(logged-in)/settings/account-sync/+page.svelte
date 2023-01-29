<script lang="ts">
  import { enhance } from "$app/forms";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: ({ legacySync } = data);

  let running = false;
  let notFound = false;
  let success = false;

  const execute = () => {
    running = true;
    success = notFound = false;

    return async ({ result }: any) => {
      running = false;
      if (result.success) {
        success = true;
      }

      console.log({ result });
    };
  };
</script>

<form method="post" action="?/attemptSync" use:enhance={execute}>
  <FlexRow>
    <div class="col-md-6 col-sm-12">
      <Stack>
        {#if legacySync}
          <div class="alert alert-info">You've already sync'd your account</div>
        {:else if success}
          <div class="alert alert-success">Your account is now sync'd. You'll be logged out in a few moments. Log back in to see your books.</div>
        {:else}
          <div class="alert alert-info">
            If you had an account with the old version of this site, with an email/password, your books are safe, where you left them
            <br />
            <br />
            Just enter your email address and password, and your current account will become sync'd with your old one
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input name="email" class="form-control" id="email" />
          </div>
          <div class="form-group">
            <label for="password">New password</label>
            <input name="password" type="password" class="form-control" id="password" />
          </div>
          <ActionButton
            isRunning={running}
            style="align-self: flex-start; min-width: 10ch;"
            text="Sync"
            runningText="Syncing"
            finishedText="Done"
            preset="primary"
          />
        {/if}

        {#if notFound}
          <div>
            <br />
            <div class="alert alert-danger">Passwords must match</div>
          </div>
        {/if}

        {#if success}
          <div>
            <br />
            <div class="alert alert-success">Your password has been updated</div>
          </div>
        {/if}
      </Stack>
    </div>
  </FlexRow>
</form>
