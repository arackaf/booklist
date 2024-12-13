<svelte:options runes={true} />

<script lang="ts">
  import Alert from "$lib/components/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import InputGroup from "$lib/components/form-elements/Input/InputGroup.svelte";
</script>

<div class="max-w-[400px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[550px]">
  <div data-reach-dialog-content class="border-4 border-[var(--primary-3)] rounded-xl lg:p-5 p-3">
    <h4>Book Search</h4>
    <hr class="my-4" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="col-span-2">
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Title">
            <Input slot="input" placeholder="Search title" value="The Slefish Gene" />
          </InputGroup>

          <Alert type="warning">Did you spell this right?</Alert>
        </div>
      </div>
      <div class="col-span-2 md:col-span-1">
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Publisher">
            <Input slot="input" placeholder="Publisher" value="Basic Books" />
          </InputGroup>

          <Alert type="success">Looks good to me!</Alert>
        </div>
      </div>
      <div class="col-span-2 md:col-span-1">
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Author">
            <Input slot="input" placeholder="Author" />
          </InputGroup>
          <Alert type="error">Author is required!</Alert>
        </div>
      </div>
    </div>
    <hr />
    <div class="flex flex-row">
      <Button theme="primary">Filter</Button>
      <Button class="ml-auto">Close</Button>
    </div>
  </div>
  <Alert type="info" class="mt-2">This color theme will be saved locally, and remembered the next time you browse here (on the same device)</Alert>
</div>
