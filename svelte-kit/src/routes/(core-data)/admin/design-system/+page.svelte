<script lang="ts">
  import ActionButtonNew from "$lib/components/Button/ActionButton.svelte";

  import Alert from "$lib/components/ui/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import Select from "$lib/components/ui/Select/Select.svelte";
  import SelectGroup from "$lib/components/ui/Select/SelectGroup.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";
  import IconButton from "$lib/components/Button/IconButton.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import Label from "$lib/components/ui/Label/Label.svelte";

  let running = false;
  function clickButton() {
    running = true;
    setTimeout(() => {
      running = false;
    }, 500);
  }
</script>

<div class="grid gap-4 buttons" style="grid-template-columns: 120px 120px;">
  <div>
    <h1>Old</h1>
    <hr />
  </div>
  <div>
    <h1>New</h1>
    <hr />
  </div>

  <div />
  <div>
    <Alert type="info">Hello World</Alert>
  </div>

  <div />
  <div>
    <Alert type="info" layout="slim">Hello World</Alert>
  </div>

  <div />
  <div>
    <Alert type="info" layout="slimmer">Hello World</Alert>
  </div>

  <div />
  <div>
    <Alert type="success">Hello World</Alert>
  </div>

  <div />
  <div>
    <Alert type="warning">Hello World</Alert>
  </div>

  <div />
  <div>
    <Alert type="error">Hello World</Alert>
  </div>

  <div />
  <div>
    <Label display="inline-block">Hello Worlding</Label>
  </div>

  <div />
  <div>
    <Label display="inline-block">Hello Worlding</Label>
  </div>

  <div />
  <div>
    <Label theme="success">Success</Label>
  </div>

  <div />
  <div>
    <Label display="inline-block" theme="success">Success</Label>
  </div>

  <div />
  <div>
    <Label theme="error">Error Message</Label>
  </div>

  <div />
  <div>
    <Label display="inline-block" theme="error">Error Message</Label>
  </div>

  <h1>Book cover</h1>
  <div />

  <div />
  <div>
    <BookCover
      size="mobile"
      preview={{
        h: 54,
        w: 35,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AM7OzbiztLa5uAD////Qzs23vboACxMCDRMArLSvAHp/eHZ2dMPLyN76FbyD1p+mAAAAAElFTkSuQmCC"
      }}
      url="https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/15eb8649-2b41-4f26-90d2-f0ac7118cfe9.jpg"
    />
  </div>

  <div />
  <div>
    <BookCover
      size="small"
      preview={{
        h: 77,
        w: 50,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AM7OzbiztLa5uAD////Qzs23vboACxMCDRMArLSvAHp/eHZ2dMPLyN76FbyD1p+mAAAAAElFTkSuQmCC"
      }}
      url="https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/15eb8649-2b41-4f26-90d2-f0ac7118cfe9.jpg"
    />
  </div>

  <div />
  <div>
    <BookCover
      size="medium"
      preview={{
        h: 164,
        w: 106,
        b64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAM0lEQVR4nAEoANf/AM7OzbiztLa5uAD////Qzs23vboACxMCDRMArLSvAHp/eHZ2dMPLyN76FbyD1p+mAAAAAElFTkSuQmCC"
      }}
      url="https://my-library-cover-uploads.s3.amazonaws.com/medium-covers/60a93babcc3928454b5d1cc6/15eb8649-2b41-4f26-90d2-f0ac7118cfe9.jpg"
    />
  </div>

  <div />
  <div>
    <BookCover size="mobile" />
  </div>

  <div />
  <div>
    <BookCover size="small" />
  </div>

  <div />
  <div>
    <BookCover size="medium" />
  </div>

  <h1>Anchor Button</h1>
  <div />

  <div />
  <div>
    <div class="flex">
      <Button href="/foo" icon={true} class="connect-right">
        <span class="sr">Go a page up</span>
        <i class="fal fa-fw fa-angle-right" />
      </Button>
      <Button this={"button"} disabled={true} class="connect-left" icon={true}>
        <span class="sr">Go to last page</span>
        <i class="fal fa-fw fa-angle-double-right" />
      </Button>
    </div>
  </div>

  <div />
  <div>
    <SelectGroup labelText="Title">
      <Select slot="select">
        <option value="a">A</option>
        <option value="b">Hello World Hello World</option>
      </Select>
    </SelectGroup>
  </div>

  <div />
  <div>
    <select class="border rounded w-36">
      <option value="a">A</option>
      <option value="b">B</option>
    </select>
  </div>

  <h1>Input Group</h1>
  <div />

  <div />
  <div>
    <InputGroup labelText="Title">
      <Input slot="input" id="fc2" />
    </InputGroup>
  </div>

  <h1>Input</h1>
  <div />

  <div />
  <div>
    <Input />
  </div>

  <h1>Input error</h1>
  <div />

  <div />
  <div>
    <Input error={true} />
  </div>

  <h1>Primary</h1>
  <div />

  <div />
  <div>
    <Button theme="primary">Button</Button>
  </div>

  <h1>Info</h1>
  <div />

  <div />
  <div>
    <Button theme="info">Button</Button>
  </div>

  <h1>Success</h1>
  <div />

  <div />
  <div>
    <Button theme="success">Button</Button>
  </div>

  <h1>Danger</h1>
  <div />

  <div />
  <div>
    <Button type="primary" theme="danger">Button</Button>
  </div>

  <h1>ActionButton</h1>
  <div />

  <div />
  <div>
    <ActionButtonNew {running} on:click={clickButton}>Search</ActionButtonNew>
  </div>

  <h1>ActionButton</h1>
  <div />

  <div />
  <div>
    <ActionButtonNew theme="primary" {running} on:click={clickButton}>Search</ActionButtonNew>
  </div>

  <div />
  <div>
    <ActionButtonNew {running} on:click={clickButton}>
      Search
      <span slot="running">Searching</span>
    </ActionButtonNew>
  </div>

  <h1>Icon Button</h1>
  <div />

  <div />
  <div>
    <IconButton>
      <i class="fal fa-fw fa-search" />
    </IconButton>
  </div>

  <h1>Default</h1>
  <div />

  <div />
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

  <div />
  <div>
    <Button size="sm">Buttoning</Button>
  </div>

  <h1>danger-sm</h1>
  <div />

  <div />
  <div>
    <Button size="sm" theme="danger">Buttoning</Button>
  </div>

  <h1>Disabled</h1>
  <div />

  <div />
  <div>
    <Button type="primary" disabled={true}>Button</Button>
  </div>

  <h1>Default</h1>
  <div />

  <div />
  <div>
    <Button>Button</Button>
  </div>

  <h1>Disabled</h1>
  <div />

  <div />
  <div>
    <Button disabled>Button</Button>
  </div>
</div>
