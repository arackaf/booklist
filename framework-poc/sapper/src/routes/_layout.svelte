<script>
  import Nav from "../components/Nav.svelte";

  import "../../static/global.css";

  export let segment;
</script>

<style>
  main {
    padding: 20px;
  }
</style>

<Nav {segment} />

<main class="scheme3">
  <slot />
</main>
