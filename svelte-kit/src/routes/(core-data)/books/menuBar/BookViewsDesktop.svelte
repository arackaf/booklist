<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/components/ui/Button/Button.svelte";

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
  <Button disabled={bookViewToUse == GRID_VIEW || anyBooksSelected} softDisable={true} class="h-8 connect-right">
    <i class="fal fa-fw fa-table" />
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button disabled={bookViewToUse == COVERS_LIST || anyBooksSelected} softDisable={true} class="h-8 connect-right connect-left">
    <i class="fas fa-fw fa-th" />
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected} softDisable={true} class="h-8 connect-left">
    <i class="fal fa-fw fa-list" />
  </Button>
</form>
