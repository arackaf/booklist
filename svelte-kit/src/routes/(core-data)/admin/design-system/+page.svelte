<script>
  import Button from "$lib/components/ui/Button/Button.svelte";
</script>

<div class="buttons">
  <div>
    <h1>Old</h1>
  </div>
  <div>
    <h1>New</h1>
  </div>

  <div>
    <button class="btn btn-primary">Button</button>
  </div>
  <div>
    <Button>Button</Button>
  </div>
</div>

<style>
  .buttons {
    display: grid;
    gap: 15px;
    grid-template-columns: min-content min-content;
  }
</style>
