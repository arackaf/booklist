<script lang="ts">
  import ActionButtonNew from "$lib/components/ui/Button/ActionButton.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";

  import Select from "$lib/components/ui/Select/Select.svelte";
  import SelectGroup from "$lib/components/ui/Select/SelectGroup.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";
  import IconButton from "$lib/components/ui/Button/IconButton.svelte";

  let running = false;
  function clickButton() {
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

  <h1>Select Group</h1>
  <div />

  <div class="form-group">
    <label for="fc">Title</label>
    <select id="fc" class="form-control">
      <option value="a">A</option>
      <option value="b">Hello World Hello World</option>
    </select>
  </div>
  <div>
    <SelectGroup labelText="Title">
      <Select slot="select">
        <option value="a">A</option>
        <option value="b">Hello World Hello World</option>
      </Select>
    </SelectGroup>
  </div>

  <div class="form-group">
    <label for="fc">Title</label>
    <select id="fc" class="form-control">
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  </div>
  <div>
    <select class="border rounded w-36">
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  </div>

  <h1>Input Group</h1>
  <div />

  <div class="form-group">
    <label for="fc">Title</label>
    <input id="fc" class="form-control" />
  </div>
  <div>
    <InputGroup labelText="Title">
      <Input slot="input" id="fc2" />
    </InputGroup>
  </div>

  <h1>Input</h1>
  <div />

  <div class="form-group">
    <input class="form-control" />
  </div>
  <div>
    <Input />
  </div>

  <h1>Input error</h1>
  <div />

  <div class="form-group">
    <input class="form-control error" />
  </div>
  <div>
    <Input error={true} />
  </div>

  <h1>Primary</h1>
  <div />

  <div>
    <button class="btn btn-primary">Button</button>
  </div>
  <div>
    <Button theme="primary">Button</Button>
  </div>

  <h1>Success</h1>
  <div />

  <div>
    <button class="btn btn-success">Button</button>
  </div>
  <div>
    <Button theme="success">Button</Button>
  </div>

  <h1>Danger</h1>
  <div />

  <div>
    <button class="btn btn-danger">Button</button>
  </div>
  <div>
    <Button type="primary" theme="danger">Button</Button>
  </div>

  <h1>ActionButton</h1>
  <div />

  <div>
    <button class="btn" on:click={clickButton} disabled={running}>Search</button>
  </div>
  <div>
    <ActionButtonNew {running} on:click={clickButton}>Search</ActionButtonNew>
  </div>

  <h1>ActionButton</h1>
  <div />

  <div>
    <button class="btn" on:click={clickButton} disabled={running}>Search</button>
  </div>
  <div>
    <ActionButtonNew theme="primary" {running} on:click={clickButton}>Search</ActionButtonNew>
  </div>

  <div>
    <button class="btn" on:click={clickButton} disabled={running}>Search</button>
  </div>
  <div>
    <ActionButtonNew {running} on:click={clickButton}>
      Search
      <span slot="running">Searching</span>
    </ActionButtonNew>
  </div>

  <h1>Icon Button</h1>
  <div />

  <div>
    <button class="btn btn-default">
      <i class="fal fa-fw fa-search" />
    </button>
  </div>
  <div>
    <IconButton class="btn btn-default">
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

  <h1>Med</h1>
  <div />

  <div>n/a</div>
  <div>
    <Button size="med">Button</Button>
  </div>

  <h1>sm</h1>
  <div />

  <div>
    <button class="btn btn-xs">Button</button>
  </div>
  <div>
    <Button size="sm">Buttoning</Button>
  </div>

  <h1>danger-sm</h1>
  <div />

  <div>
    <button class="btn btn-xs btn-danger">Button</button>
  </div>
  <div>
    <Button size="sm" theme="danger">Buttoning</Button>
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
    grid-template-columns: 120px 120px;
  }
</style>
