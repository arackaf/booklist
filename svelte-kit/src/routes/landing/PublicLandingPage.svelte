<script lang="ts">
  import { signIn } from "@auth/sveltekit/client";
</script>

<section>
  <div style="margin-left: auto; margin-right: auto; max-width: 1200px">
    <div>
      <div style="position: relative">
        <div style="display: flex">
          <div style="max-width: 800px; margin-top: 25px; margin-left: auto; margin-right: auto">
            Welcome to
            <i>My Library</i>.<br />
            <br />
            This site is my own little passion project, which tracks your library. You scan your books (or manually type in the isbn) and the books' info
            is fetched from ISBN DB, and stored for you. You can then search and categorize your library.
            <br />
            <br />
            So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot,
            own the books they read, and read non-eBooks. Again, it's is more of a passion project than anything.
            <br />
            <br />
            It's free and I won't ever sell your info, so give it a try!
            <br />
            <br />
            For those interested in seeing the code for this site, the GitHub repository is{" "}
            <a target="_blank" rel="noreferrer" href="https://github.com/arackaf/booklist"> here </a>
            <br />
            <br />
            <button
              style="text-decoration: none"
              class="btn btn-primary"
              on:click={() =>
                signIn("google", {
                  callbackUrl: "/books"
                })}>Login or create an account</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
