<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";

  import { selectedBooksLookup } from "../state/selectionState";

  $: selectedBooksIds = Object.keys($selectedBooksLookup).map(s => +s);
  $: anyBooksSelected = !!selectedBooksIds.length;

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
  <button disabled={anyBooksSelected} class="h-8 btn btn-default connect-right" class:active={bookViewToUse == GRID_VIEW}>
    <i class="fal fa-fw fa-table" />
  </button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <button disabled={anyBooksSelected} class="h-8 btn btn-default connect-right connect-left" class:active={bookViewToUse == COVERS_LIST}>
    <i class="fas fa-fw fa-th" />
  </button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <button disabled={anyBooksSelected} class="h-8 btn btn-default connect-left" class:active={bookViewToUse == BASIC_LIST_VIEW}>
    <i class="fal fa-fw fa-list" />
  </button>
</form>
