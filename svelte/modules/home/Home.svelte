<script lang="ts">
  import { isLoggedIn } from "util/loginStatus";

  import HomeLoggedIn from "./HomeLoggedIn.svelte";
  import HomePublic from "./HomePublic.svelte";

  let loggedIn = isLoggedIn().logged_in;
</script>

<section>
  {#if loggedIn}
    <HomeLoggedIn />
  {:else}
    <HomePublic />
  {/if}
</section>
