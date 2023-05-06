<script>
  import Button from "$lib/components/ui/Button/Button.svelte";
</script>

<div class="buttons">
  <div>
    <h1>Old</h1>
    <button class="btn btn-primary">Button</button>
  </div>
  <div>
    <h1>New</h1>
    <Button>Button</Button>
  </div>
</div>

<style>
  .buttons {
    display: flex;
  }
  .buttons > * {
    flex: 1;
  }
</style>
