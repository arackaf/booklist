<script lang="ts">
  import { onMount } from "svelte";

  import FlexRow from "app/components/layout/FlexRow.svelte";
  import { appState } from "app/state/appState";

  const { isLoggedIn, urlState } = $appState;
  const alreadyActivated = !!urlState.searchState.alreadyActivated;

  let _timeoutToken;
  if (isLoggedIn) {
    _timeoutToken = setTimeout(() => window.location.replace("/home"), 4000);
  }

  onMount(() => () => {
    clearTimeout(_timeoutToken);
  });
</script>

<style>
  .root {
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;
  }

  .alert-holder {
    display: flex;
  }

  .alert {
    margin-left: auto;
    margin-right: auto;
  }
</style>

<section>
  <FlexRow>
    <div class="root col-xs-11 col-md-10 col-lg-6 alert-holder">
      {#if isLoggedIn}
        <div class="alert alert-success">
          Your account is activated! Redirecting you automatically, or use the menu above if you don't care to wait :-)
        </div>
      {:else if alreadyActivated}
        <div class="alert alert-warning">This activation link has already been used. Use the login link above to log back in.</div>
      {:else}
        <div class="alert alert-danger">Sorry - it looks like something went wrong. The activation link you clicked appears to be invalid.</div>
      {/if}
    </div>
  </FlexRow>
</section>
