<script lang="ts">
  import { appState } from "app/state/appState";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "app/components/layout/tabs/index";

  import PublicUserSettings from "./PublicUserSettings.svelte";
  import PasswordReset from "./PasswordReset.svelte";
  import ThemeChooser from "./ThemeChooser.svelte";

  $: ({ isPublic, isLoggedIn } = $appState);
</script>

<section>
  <Tabs defaultTab={isPublic ? "theme" : "publicSettings"} localStorageName="settings-tab">
    {#if isPublic || !isLoggedIn}
      <TabHeaders>
        <TabHeader disabled={true}><a>Public sharing</a></TabHeader>
        <TabHeader disabled={true}><a>Reset password</a></TabHeader>
        <TabHeader tabName="theme"><a>Theme</a></TabHeader>
      </TabHeaders>
    {:else}
      <TabHeaders>
        <TabHeader tabName="publicSettings"><a>Public sharing</a></TabHeader>
        <TabHeader tabName="passwordReset"><a>Reset password</a></TabHeader>
        <TabHeader tabName="theme"><a>Theme</a></TabHeader>
      </TabHeaders>
    {/if}
    <TabContents>
      {#if !isPublic && isLoggedIn}
        <TabContent style={{ minHeight: "150px" }} tabName="publicSettings">
          <PublicUserSettings />
        </TabContent>
        <TabContent style={{ minHeight: "150px" }} tabName="passwordReset">
          <PasswordReset />
        </TabContent>
      {/if}

      <TabContent style={{ minHeight: "150px" }} tabName="theme">
        <ThemeChooser />
      </TabContent>
    </TabContents>
  </Tabs>
</section>
