<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/components/Button/Button.svelte";

  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";

  import { selectedBooksLookup } from "../state/selectionState";

  $: selectedBooksIds = Object.keys($selectedBooksLookup).map(s => +s);
  $: anyBooksSelected = !!selectedBooksIds.length;

  const booksModuleContext: any = getContext("books-module-context");
  const { overrideBookView } = booksModuleContext;

  const uiViewChange = ({ formData: data }: any) => {
    overrideBookView(data.get("view"));
    return async () => {};
  };

  export let closeMobileMenu: () => void = () => {};
  export let bookViewToUse: string;
</script>

<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={GRID_VIEW} />
  <Button class="h-8" disabled={bookViewToUse == GRID_VIEW || anyBooksSelected}>
    <span>Main View</span>
    <i class="fal fa-fw fa-table ml-auto"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button class="h-8" disabled={bookViewToUse == COVERS_LIST || anyBooksSelected}>
    <span>Covers View</span>
    <i class="fas fa-fw fa-th ml-auto"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button class="h-8" disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected}>
    <span>Mobile View</span>
    <i class="fal fa-fw fa-list ml-auto"></i>
  </Button>
</form>
