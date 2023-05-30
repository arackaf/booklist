<script>
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";
</script>

<div class="demo-root">
  <div data-reach-dialog-content class="mock-modal">
    <h4>Book Search</h4>
    <hr />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Title">
            <Input slot="input" placeholder="Search title" value="The Slefish Gene" />
          </InputGroup>

          <div class="alert alert-warning margin-bottom">Did you spell this right?</div>
        </div>
      </div>
      <div>
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Publisher">
            <Input slot="input" placeholder="Publisher" class="form-control" value="Basic Books" />
          </InputGroup>

          <div class="alert alert-success margin-bottom">Looks good to me!</div>
        </div>
      </div>
      <div>
        <div class="flex flex-col gap-2">
          <InputGroup labelText="Author">
            <Input slot="input" placeholder="Author" />
          </InputGroup>
          <div class="alert alert-danger margin-bottom">Author is required!</div>
        </div>
      </div>
    </div>
    <hr />
    <div class="flex flex-row">
      <button class="btn btn-primary">Filter</button>
      <button class="btn ml-auto">Close</button>
    </div>
  </div>
  <div class="alert alert-info margin-top" style="max-width: 550px">
    This color theme will be saved locally, and remembered the next time you browse here (on the same device)
  </div>
</div>
