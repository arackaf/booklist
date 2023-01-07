<script lang="ts">
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
</script>

<div class="demo-root">
  <div data-reach-dialog-content class="mock-modal">
    <h4>Book Search</h4>
    <hr />
    <FlexRow>
      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Title</label>
          <input placeholder="Search title" class="form-control" value="The Slefish Gene" />
          <div class="alert alert-warning margin-bottom">Did you spell this right?</div>
        </div>
      </div>
      <div class="col-sm-6 col-xs-12">
        <div class="form-group">
          <label>Pages</label>
          <div class="form-inline">
            <div style="margin-right: 5px; display: inline-block" class="form-group">
              <select class="form-control">
                <option value="lt">{"<"}</option>
                <option value="gt">{">"}</option>
              </select>
            </div>
            <div class="form-group" style="display: inline-block">
              <input style="width: 100px" type="number" placeholder="Pages" class="form-control" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label>Publisher</label>
          <input placeholder="Publisher" class="form-control" value="Basic Books" />
          <div class="alert alert-success margin-bottom">Looks good to me!</div>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label>Author</label>
          <input placeholder="Author" class="form-control" />
          <div class="alert alert-danger margin-bottom">Author is required!</div>
        </div>
      </div>
    </FlexRow>
    <hr />
    <div style="display: flex">
      <button class="btn btn-primary">Filter</button>
      <button class="btn" style="margin-left: auto"> Close </button>
    </div>
  </div>
  <div class="alert alert-info margin-top" style="max-width: 550px">
    This color theme will be saved locally, and remembered the next time you browse here (on the same device)
  </div>
</div>
