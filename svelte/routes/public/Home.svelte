<script>
  import AppUI from "routes/AppUI.svelte";
</script>

<AppUI>
  <section>
    <div style="margin-left: auto; margin-right: auto; max-width: 1200px">
      <div>
        <div class="panel-body" style="position: relative">
          <div style="display: flex">
            <div style="max-width: 800px; margin-top: 25px; margin-left: auto; margin-right: auto">
              Welcome to
              <i>My Library</i>.<br />
              <br />
              This site is my own little passion project, the purpose of which is to track your library. You scan in your books (or manually type in the
              isbn) and the books' info is fetched from Amazon, and stored for you. You can then flexibly search and categorize your library.
              <br />
              <br />
              So basically this site is of use to the extremely small percentage of people for whom the following are
              <i>all</i>
              true: they read a lot, own the books they read, and read non-eBooks. As I said, this is more of a passion project than anything.
              <br />
              <br />
              It's free to sign up, and store up to 500 books. In the remote chance someone actually wants to store more than that, there'll be some sort
              of nominal fee to help defray storage costs.
              <br />
              <br />
              For those interested in seeing the code for this site, the GitHub repository is{" "}
              <a target="_blank" href="https://github.com/arackaf/booklist"> here </a>
              <br />
              <br />
              <a style="text-decoration: none" class="btn btn-primary" href="/login"> Login or create an account </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</AppUI>
