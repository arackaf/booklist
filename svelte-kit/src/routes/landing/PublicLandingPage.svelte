<script lang="ts">
  //import { signIn } from "@auth/sveltekit/client";

  import Button from "$lib/components/ui/button/button.svelte";
  import { page } from "$app/stores";
  import { authClient } from "$lib/auth-client";

  let { loggedIn } = $derived($page.data);
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: 1200px">
    <div>
      <div style="position: relative">
        <div style="display: flex">
          <div class="flex flex-col gap-6" style="max-width: 800px; margin-top: 25px; margin-left: auto; margin-right: auto">
            <span class="text-lg font-bold">
              Welcome to <span class="italic">My Library</span>
            </span>
            <span>
              This site is my own little passion project, which tracks your library. Scan your books (or manually type in the isbn) and the book info
              is fetched from ISBN DB, and stored. You can then search and categorize your library.
            </span>

            <span>
              So basically this site is of use to the extremely small percentage of people for whom the following are all true: they read a lot, own
              the books they read, and read non-eBooks. Again, it's is more of a passion project than anything.
            </span>

            <span>
              If you'd like to see the code for this site, the GitHub repository is
              <a target="_blank" rel="noreferrer" href="https://github.com/arackaf/booklist">here</a>
            </span>

            {#if !loggedIn}
              <Button
                class="self-start"
                variant="default"
                onclick={() => {
                  authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/books"
                  }); //("", { callbackUrl: "/books" });
                }}
              >
                Login or create an account
              </Button>
            {:else}
              <Button class="self-start" variant="default" href="/books">Go to your library</Button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
