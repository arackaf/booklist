<script>
  import Button from "$lib/components/ui/Button/Button.svelte";
</script>

<div class="buttons">
  <div>
    <h1>Old</h1>
    <hr />
  </div>
  <div>
    <h1>New</h1>
    <hr />
  </div>

  <h1>Primary</h1>
  <div />

  <div>
    <button class="btn btn-primary">Button</button>
  </div>
  <div>
    <Button type="primary">Button</Button>
  </div>

  <h1>Disabled</h1>
  <div />

  <div>
    <button class="btn btn-primary disabled">Button</button>
  </div>
  <div>
    <Button type="primary" disabled={true}>Button</Button>
  </div>

  <h1>Default</h1>
  <div />

  <div>
    <button class="btn">Button</button>
  </div>
  <div>
    <Button>Button</Button>
  </div>

  <h1>Disabled</h1>
  <div />

  <div>
    <button class="btn" disabled>Button</button>
  </div>
  <div>
    <Button disabled>Button</Button>
  </div>
</div>

<style>
  .buttons {
    display: grid;
    gap: 15px;
    grid-template-columns: min-content min-content;
  }
</style>
