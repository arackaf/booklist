<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";

  import Button from "$lib/components/ui/button/button.svelte";

  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";
  import { selectionState } from "../state/selectionState.svelte";
  import { LayoutGrid, LayoutListIcon, TablePropertiesIcon } from "lucide-svelte";

  type Props = {
    bookViewToUse: string;
  };

  let { bookViewToUse }: Props = $props();

  let selectedBooksIds = $derived(Object.keys(selectionState.selectedBooksLookup).map(s => +s));
  let anyBooksSelected = $derived(!!selectedBooksIds.length);

  const booksModuleContext: any = getContext("books-module-context");
  const { overrideBookView } = booksModuleContext;

  const uiViewChange = ({ formData: data }: any) => {
    overrideBookView(data.get("view"));
    return async () => {};
  };
</script>

<form method="POST" action="?/setBooksView" use:enhance={uiViewChange}>
  <input type="hidden" name="view" value={GRID_VIEW} />
  <Button type="submit" variant="outline" disabled={bookViewToUse == GRID_VIEW || anyBooksSelected} class="h-8 w-11 border-r-0 rounded-r-none">
    <TablePropertiesIcon class="rotate-180" />
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button type="submit" variant="outline" disabled={bookViewToUse == COVERS_LIST || anyBooksSelected} class="h-8 w-11 rounded-none border-r-0">
    <LayoutGrid />
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button type="submit" variant="outline" disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected} class="h-8 w-11 rounded-l-none">
    <LayoutListIcon />
  </Button>
</form>
