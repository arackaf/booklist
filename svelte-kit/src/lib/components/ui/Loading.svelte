<script>
  import { fade } from "svelte/transition";
</script>

<div in:fade>
  <i class="far fa-5x fa-spin fa-spinner" />
</div>

<style>
  div {
    position: fixed;
    left: 50%;
    top: 30%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 99999;
  }
  i {
    opacity: 0.5;
    color: var(--primary-3);
  }
</style>
