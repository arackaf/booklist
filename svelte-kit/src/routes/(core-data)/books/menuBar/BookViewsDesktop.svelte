<script lang="ts">
  import { getContext } from "svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/components/Button/Button.svelte";

  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";
  import { selectionState } from "../state/selectionState.svelte";

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
  <Button disabled={bookViewToUse == GRID_VIEW || anyBooksSelected} softDisable={true} class="h-8 connect-right">
    <i class="fal fa-fw fa-table"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange}>
  <input type="hidden" name="view" value={COVERS_LIST} />
  <Button disabled={bookViewToUse == COVERS_LIST || anyBooksSelected} softDisable={true} class="h-8 connect-right connect-left">
    <i class="fas fa-fw fa-th"></i>
  </Button>
</form>
<form method="POST" action="?/setBooksView" use:enhance={uiViewChange}>
  <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
  <Button disabled={bookViewToUse == BASIC_LIST_VIEW || anyBooksSelected} softDisable={true} class="h-8 connect-left">
    <i class="fal fa-fw fa-list"></i>
  </Button>
</form>
