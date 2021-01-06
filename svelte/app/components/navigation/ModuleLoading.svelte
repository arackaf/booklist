<script>
import SpinnerSvg from "./SpinnerSvg.svelte";

</script>

<style>
  .module-loading {
    position: fixed;
    top: calc(50% - 100px);
    left: calc(50% - 40px);
    z-index: 10;
    opacity: 0.7;
  }
  
  :global(.module-loading > *) {
    z-index: 1;
    fill: var(--primary-4);
  }
</style>

<div class="module-loading">
  <SpinnerSvg class="fa-spin" width="80" />
</div>
