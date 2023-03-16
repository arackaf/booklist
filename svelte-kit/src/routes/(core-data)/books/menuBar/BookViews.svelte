<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";

  const booksModuleContext: any = getContext("books-module-context");
  const { overrideBookView } = booksModuleContext;

  const uiViewChange = ({ data }: any) => {
    overrideBookView(data.get("view"));
    return async () => {};
  };

  export let closeMobileMenu: () => void = () => {};
  export let bookViewToUse: string;
</script>

<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={GRID_VIEW} />
  <button class="btn btn-default first-child" class:active={bookViewToUse == GRID_VIEW}>
    <span>Main View</span>
    <i class="fal fa-fw fa-table" />
  </button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <button class="btn btn-default" class:active={bookViewToUse == COVERS_LIST}>
    <span>Covers View</span>
    <i class="fas fa-fw fa-th" />
  </button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <button class="btn btn-default last-child" class:active={bookViewToUse == BASIC_LIST_VIEW}>
    <span>Mobile View</span>
    <i class="fal fa-fw fa-list" />
  </button>
</form>
