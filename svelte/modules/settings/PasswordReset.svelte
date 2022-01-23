<script lang="ts">
  import ajaxUtil from "util/ajaxUtil";

  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import { appState } from "app/state/appState";

  const exectueResetPassword = (oldPassword, newPassword) => {
    return ajaxUtil.postAuth("/resetPassword", { oldPassword, newPassword }, resp => {});
  };

  $: ({ online } = $appState);
  let saving = false;

  let mismatch = false;
  let wrongPassword = false;
  let saved = false;

  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";

  const resetPassword = evt => {
    evt?.preventDefault();
    if (newPassword != confirmPassword) {
      mismatch = true;
      return;
    }

    mismatch = false;
    wrongPassword = false;
    saving = true;

    return Promise.resolve(exectueResetPassword(currentPassword, newPassword)).then((res: any) => {
      if (res.error == 1) {
        wrongPassword = true;
      } else if (res.success) {
        currentPassword = "";
        newPassword = "";
        confirmPassword = "";

        saved = true;

        setTimeout(() => (saved = false), 2000);
      }
      saving = false;
    });
  };
</script>

<form on:submit={resetPassword}>
  <FlexRow>
    <div class="col-md-6 col-sm-12">
      <Stack>
        <div class="form-group">
          <label for="existingPasswordInput">Current password</label>
          <input bind:value={currentPassword} type="password" class="form-control" id="existingPasswordInput" />
        </div>
        <div class="form-group">
          <label for="newPasswordInput">New password</label>
          <input bind:value={newPassword} type="password" class="form-control" id="newPasswordInput" />
        </div>
        <div class="form-group">
          <label for="confirmNewPasswordInput">Confirm new password</label>
          <input bind:value={confirmPassword} type="password" class="form-control" id="confirmNewPasswordInput" />
        </div>
        <ActionButton
          style="align-self: flex-start; min-width: 10ch;"
          onClick={resetPassword}
          text="Save"
          disabled={saved}
          runningText="Saving"
          preset="primary"
        />

        {#if mismatch}
          <div>
            <br />
            <div class="alert alert-danger">Passwords must match</div>
          </div>
        {/if}
        {#if wrongPassword}
          <div>
            <br />
            <div class="alert alert-danger">Your existing password does not match</div>
          </div>
        {/if}
        {#if saved}
          <div>
            <br />
            <div class="alert alert-success">Your password has been updated</div>
          </div>
        {/if}
      </Stack>
    </div>
  </FlexRow>
</form>
