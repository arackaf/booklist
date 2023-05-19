<script>
  import ActionIconButton from "$lib/components/buttons/ActionIconButton.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";
  import IconButton from "$lib/components/ui/Button/IconButton.svelte";

  let running = false;
  function clickIconButton() {
    running = true;
    setTimeout(() => {
      running = false;
    }, 500);
  }
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

  <h1>Icon Button</h1>
  <div />

  <div>
    <ActionIconButton onClick={clickIconButton} class="btn btn-default" disabled={running}>
      <i class:fa-spin={running} class:fa-spinner={running} class:fa-search={!running} class="fal fa-fw" />
    </ActionIconButton>
  </div>
  <div>
    <IconButton on:click={clickIconButton} class="btn btn-default" disabled={running}>
      <i class="fal fa-fw fa-search" />
    </IconButton>
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
