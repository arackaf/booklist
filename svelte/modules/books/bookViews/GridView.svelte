<script lang="ts">
  import { getContext } from "svelte";
  import { query } from "micro-graphql-svelte";
  import { QueryOf, Queries } from "graphql-typings";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import LabelDisplay from "app/components/subjectsAndTags/LabelDisplay.svelte";

  import { appState } from "app/state/appState";
  import { IBookDisplay } from "../booksState";

  import { currentSearch } from "../booksSearchState";

  import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";

  import BookRow from "./BookRow.svelte";
  //import { CoverSmall } from "app/components/bookCoverComponent";
  import { setBooksSort, addFilterSubject, addFilterTag } from "modules/books/setBookFilters";
  import { derived } from "svelte/store";

  $: ({ isPublic: viewingPublic, online } = $appState);

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, dispatchBooksUiState } = booksModuleContext;

  //const { book, booksUiState, dispatchBooksUiState, setRead, runDelete } = props;
  //const { _id } = book;
  $: ({ selectedBooks } = $booksUiState);

  export let books = [];

  let bookSelection;
  $: {
    //= books, selectedBooks) => {

    let selectedIdsCount = Object.keys(selectedBooks).filter(_id => selectedBooks[_id]).length;
    bookSelection = {
      allAreChecked: books.length == selectedIdsCount,
      selectedBooksCount: selectedIdsCount,
      selectedBookHash: selectedBooks
    };
  }

  // const { actions, booksUiState, dispatchBooksUiState } = useContext(BooksModuleContext);
  // const { setRead, runDelete } = actions;

  // const { editBook, openBookSubModal, openBookTagModal } = actions;
  // const { selectedBooks } = booksUiState;

  // const [{ isPublic: viewingPublic, online }] = useContext(AppContext);
  // const { sort: currentSort, sortDirection } = useCurrentSearch();

  // const editSubjectsForBook = book => openBookSubModal([book]);
  // const editTagsForBook = book => openBookTagModal([book]);

  const toggleCheckAll = () => {
    dispatchBooksUiState([bookSelection.allAreChecked ? "de-select" : "select", books.map(b => b._id)]);
  };

  // const setSort = column => {
  //   let newDirection = "asc";
  //   if (currentSort === column) {
  //     newDirection = sortDirection == "asc" ? "desc" : "asc";
  //   }

  //   setBooksSort(column, newDirection);
  // };

  // const potentialSortIcon = <i class={"fa fa-angle-" + (sortDirection == "asc" ? "up" : "down")} />;
  // const sortIconIf = column => (column == currentSort ? potentialSortIcon : null);

  export let menuBarHeight;
  $: stickyHeaderStyle = `position: sticky; top: ${menuBarHeight - 8}px; background-color: white; z-index: 2`;

  /*
              <BookRow
              <!-- editBooksSubjects={editSubjectsForBook} -->
              <!-- editBooksTags={editTagsForBook} -->
              <!-- {...{ book, editBook, online, setRead, booksUiState, dispatchBooksUiState, runDelete }} -->
            />
  */

  const sortIconIf = x => "";
</script>

<div style="min-height: 400px">
  {#if books.length}
    <div>
      <table style="position: relative" class="table no-padding-top">
        <thead>
          <tr>
            {#if !viewingPublic && online}
              <th style="{stickyHeaderStyle}; text-align: center; width: 25px;">
                <a style="font-size: 12pt" on:click={toggleCheckAll}>
                  <i class={'fal ' + (!!bookSelection.allAreChecked ? 'fa-check-square' : 'fa-square')} />
                </a>
              </th>
            {/if}
            <th style="{stickyHeaderStyle}; width: 60px" />
            <th style="{stickyHeaderStyle}; min-width: 200px">
              <a class="no-underline" onClick={() => setSort('title')}> Title {sortIconIf('title')} </a>
            </th>
            <th style="min-width: 90px; {stickyHeaderStyle}">Subjects</th>
            <th style="min-width: 90px; {stickyHeaderStyle}">Tags</th>
            <th style="min-width: 90px; {stickyHeaderStyle}" />
            <th style={stickyHeaderStyle} />
            <th style="min-width: 85px; {stickyHeaderStyle}">
              <a class="no-underline" onClick={() => setSort('pages')}> Pages {sortIconIf('pages')} </a>
            </th>
            <th style={stickyHeaderStyle}><a class="no-underline" onClick={() => setSort('_id')}> Added {sortIconIf('_id')} </a></th>
          </tr>
        </thead>
        <tbody>
          {#each books as book (book._id)}
            <BookRow {book} />
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
