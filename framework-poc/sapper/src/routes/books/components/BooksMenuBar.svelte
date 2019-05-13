<script>
  import history from "../../../util/history";

  function keydown(e) {
    if (e.keyCode == 13) {
      history.push({
        pathname: "/",
        search: e.target.value ? `search=${e.target.value}` : void 0
      });
    }
  }
</script>

<div>
  <input class="form-control" placeholder="Search" on:keydown={keydown} />
</div>
