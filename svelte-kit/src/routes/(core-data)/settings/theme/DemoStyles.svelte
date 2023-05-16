<script lang="ts">
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
</script>

<div class="demo-root">
  <div data-reach-dialog-content class="mock-modal">
    <h4>Book Search</h4>
    <hr />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="md:col-span-2">
        <div class="form-group">
          <label for="demo-title">Title</label>
          <input id="demo-title" placeholder="Search title" class="form-control" value="The Slefish Gene" />
          <div class="alert alert-warning margin-bottom">Did you spell this right?</div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="demo-publisher">Publisher</label>
          <input id="demo-publisher" placeholder="Publisher" class="form-control" value="Basic Books" />
          <div class="alert alert-success margin-bottom">Looks good to me!</div>
        </div>
      </div>
      <div>
        <div class="form-group">
          <label for="demo-author">Author</label>
          <input id="demo-author" placeholder="Author" class="form-control" />
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
