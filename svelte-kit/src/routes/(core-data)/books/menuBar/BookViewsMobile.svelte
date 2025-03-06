<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/components/ui/button/button.svelte";

  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";
  import { selectionState } from "../state/selectionState.svelte";
  import { LayoutGrid, LayoutListIcon, TablePropertiesIcon } from "lucide-svelte";

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
    <TablePropertiesIcon class="rotate-180 ml-auto" />
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} onsubmit={closeMobileMenu}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button variant="outline" size="sm" type="submit" disabled={bookViewToUse == COVERS_LIST || anyBooksSelected}>
    <span>Covers View</span>
    <LayoutGrid class="ml-auto" />
  </Button>
</form>
<form method="POST" action="?/setBooksView" class="contents" use:enhance={uiViewChange} onsubmit={closeMobileMenu}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button variant="outline" size="sm" type="submit" disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected}>
    <span>Mobile View</span>
    <LayoutListIcon class="ml-auto" />
  </Button>
</form>
