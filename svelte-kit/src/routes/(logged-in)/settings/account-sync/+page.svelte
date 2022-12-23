<script lang="ts">
  import { enhance } from "$app/forms";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  let running = false;
  let notFound = false;
  let success = false;

  const execute = () => {
    running = true;
    success = notFound = false;

    return async ({ result }: any) => {
      running = false;

      console.log({ result });
    };
  };
</script>

<form method="post" action="?/attemptSync" use:enhance={execute}>
  <FlexRow>
    <div class="col-md-6 col-sm-12">
      <Stack>
        <div class="form-group">
          <label for="email">Email</label>
          <input name="email" class="form-control" id="email" />
        </div>
        <div class="form-group">
          <label for="password">New password</label>
          <input name="password" type="password" class="form-control" id="password" />
        </div>
        <ActionButton isRunning={running} style="align-self: flex-start; min-width: 10ch;" text="Save" runningText="Saving" preset="primary" />

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
