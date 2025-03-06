<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/components/ui/button/button.svelte";

  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";
  import { selectionState } from "../state/selectionState.svelte";

  type Props = {
    closeMobileMenu: () => void;
    bookViewToUse: string;
  };

  let { closeMobileMenu, bookViewToUse }: Props = $props();

  let selectedBooksIds = $derived(Object.keys(selectionState.selectedBooksLookup).map(s => +s));
  let anyBooksSelected = $derived(!!selectedBooksIds.length);

  const booksModuleContext: any = getContext("books-module-context");
  const { overrideBookView } = booksModuleContext;

  const uiViewChange = ({ formData: data }: any) => {
    overrideBookView(data.get("view"));
    return async () => {};
  };
</script>

<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} onsubmit={closeMobileMenu}>
  <input type="hidden" name="view" value={GRID_VIEW} />
  <Button variant="outline" size="sm" type="submit" disabled={bookViewToUse == GRID_VIEW || anyBooksSelected}>
    <span>Main View</span>
    <i class="fal fa-fw fa-table ml-auto"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} onsubmit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button variant="outline" size="sm" type="submit" disabled={bookViewToUse == COVERS_LIST || anyBooksSelected}>
    <span>Covers View</span>
    <i class="fas fa-fw fa-th ml-auto"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} onsubmit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button variant="outline" size="sm" type="submit" disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected}>
    <span>Mobile View</span>
    <i class="fal fa-fw fa-list ml-auto"></i>
  </Button>
</form>
