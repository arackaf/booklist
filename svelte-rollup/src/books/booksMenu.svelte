<script>
  import searchState from "./searchState.js";

  const keyDown = e => {
    if (e.keyCode == 13) {
      searchState.set({ search: e.target.value });
    }
  };
</script>

<h1>Current Search: {$searchState.search}</h1>
<input on:keydown={keyDown} />
