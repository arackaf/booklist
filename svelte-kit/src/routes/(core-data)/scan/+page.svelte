<script lang="ts">
  import type { Book } from "$data/types";

  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import EditBookModal from "$lib/components/editBook/EditBookModal.svelte";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";

  import ScanResults from "./ScanResults.svelte";
  import BookEntryItem from "./BookEntryItem.svelte";

  export let data: any;

  $: ({ subjects: allSubjects, tags } = data);

  const defaultEmptyBook = () =>
    ({
      title: "",
      isbn: "",
      pages: "",
      publisher: "",
      publicationDate: "",
      authors: [""],
      tags: [],
      subjects: []
    } as unknown as Book);

  let editingBook: Book | null = null;

  let enteringBook = false;

  const manuallyEnterBook = () => {
    editingBook = defaultEmptyBook();
    enteringBook = true;
  };

  let showScanInstructions = false;

  let focused = 0;
  let selected: any = null;

  const entryFinished = (index: number) => {
    if (index < 9) {
      focused = index + 1;
      selected = index + 1;
    } else {
      focused = 0;
      selected = 0;
    }
  };
</script>

<section>
  <FlowItems pushLast={true} xsFlowReverse={true}>
    <div style="flex: 1">
      <div style="display: flex; align-items: center">
        <h4 style="margin-top: 0; margin-bottom: 0; font-size: 16px">
          Enter your books here
          <button class="raw-button cursor-pointer" on:click={() => (showScanInstructions = !showScanInstructions)}>
            <i class="far fa-question-circle" />
          </button>
        </h4>
        <button class="btn btn-xs margin-left" on:click={manuallyEnterBook}> Manual entry </button>
      </div>
      <div style="margin-top: 10px">
        <SlideAnimate open={showScanInstructions} class="card card-info card-slim" style="width: 80%">
          <div>
            Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode scanner to search for each
            book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
            <br />
            <br />
            After you enter the isbn in the last textbox, focus will jump back to the first. This is to make scanning a large number of books with a barcode
            scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else they may get overridden.
          </div>
        </SlideAnimate>
      </div>
      <br />

      {#each Array.from({ length: 10 }) as _, idx}
        <div>
          <BookEntryItem
            {idx}
            on:focus={() => (focused = idx)}
            focused={idx == focused}
            selected={idx == selected}
            entryFinished={() => entryFinished(idx)}
          />
        </div>
      {/each}
    </div>
    <ScanResults />
    <EditBookModal
      isOpen={enteringBook}
      book={editingBook}
      subjects={allSubjects}
      {tags}
      onSave={() => (editingBook = defaultEmptyBook())}
      onHide={() => (enteringBook = false)}
    />
  </FlowItems>
</section>
