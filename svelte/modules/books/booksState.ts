import { onMount } from "svelte/internal";
import { get, derived, Readable } from "svelte/store";
import { query } from "micro-graphql-svelte";

import { QueryOf, Queries, Book } from "graphql-typings";
import { graphqlClient } from "util/graphql";
import { tagsState } from "app/state/tagsState";
import { subjectsState } from "app/state/subjectsState";
import { clearCache, syncCollection } from "util/graphqlCacheHelpers";
import GetBooksQuery from "graphQL/books/getBooks.graphql";

import { currentSearch } from "./booksSearchState";
import { computeBookSearchVariables } from "./booksLoadingUtils";
import { preloadBookImages } from "util/imagePreload";
import { COVERS_LIST } from "./booksUiState";

export interface BookResultsPacket {
  books: any[];
  totalPages: number;
  resultsCount: string | number;
  reload?: () => void;
  booksLoading?: boolean;
  booksLoaded?: boolean;
}

interface IEditorialReview {
  content: string;
  source: string;
}

interface IBookSummary {
  title: string;
  asin: string;
  authors: string[];
  smallImage: string;
}

export interface IBookRaw {
  _id: string;
  dateAdded: number;
  ean: string;
  editorialReviews: IEditorialReview[];
  similarBooks: IBookSummary[];
  isRead: boolean;
  readChanging?: boolean;
  isbn: string;
  smallImage: string;
  mediumImage: string;
  pages: any;
  publicationDate: any;
  publisher: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
  titleLower: string;
  userId: string;
  deleting?: boolean;
  pendingDelete?: boolean;
  expanded: boolean;
  detailsLoaded: boolean;
  detailsLoading: boolean;
}

export interface IBookDisplay extends IBookRaw {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
}

let createSubscription;

function booksActive() {
  createSubscription?.();
  createSubscription = null;

  window.removeEventListener("ws-info", booksInActiveWsHandler);
}

function booksInactive() {
  createSubscription = graphqlClient.subscribeMutation({ when: /createBook/, run: () => clearCache(GetBooksQuery) });

  window.addEventListener("ws-info", booksInActiveWsHandler);
}

function booksInActiveWsHandler(evt) {
  if (evt?.detail?.type == "scanResults") {
    clearCache(GetBooksQuery);
  }
}

export const searchBooks = (uiView: Readable<{ view: string; pendingView: string }>) => {
  const onBooksMutation = [
    {
      when: /createBook/,
      run: ({ softReset }) => softReset()
    },
    {
      when: /updateBooks?/,
      run: ({ currentResults: current, softReset }, resp) => {
        current.allBooks.Books = syncCollection(current.allBooks.Books, resp.updateBooks ? resp.updateBooks.Books : [resp.updateBook.Book]);
        softReset(current);
      }
    },
    {
      when: /deleteBook/,
      run: ({ softReset, currentResults }, _, req) => {
        let toRemove = currentResults.allBooks.Books.find(b => b._id == req._id);
        if (toRemove) {
          currentResults.allBooks.Books = currentResults.allBooks.Books.filter(b => b != toRemove);
          currentResults.allBooks.Meta.count--;
        }

        softReset(currentResults);
      }
    }
  ];

  const { queryState, sync } = query<QueryOf<Queries["allBooks"]>>(GetBooksQuery, {
    onMutation: onBooksMutation,
    postProcess: resp => preloadBookImages(resp, get(uiView).pendingView == COVERS_LIST)
  });
  const booksActiveWsHandler = evt => {
    if (evt?.detail?.type == "bookAdded") {
      get(queryState).softReset();
    }
  };

  const variablesSyncTeardown = currentSearch.subscribe(searchState => {
    sync(computeBookSearchVariables(searchState));
  });

  onMount(() => {
    window.addEventListener("ws-info", booksActiveWsHandler);
    booksActive();

    return () => {
      booksInactive();
      window.removeEventListener("ws-info", booksActiveWsHandler);
      variablesSyncTeardown();
    };
  });

  return derived([queryState, subjectsState, tagsState, currentSearch], ([booksState, subjectsState, tagsState, searchState]) => {
    const { data, loaded, currentQuery, reload, loading } = booksState;

    const booksRaw = data ? data.allBooks.Books : null;
    const books: Book[] = adjustBooks(booksRaw, subjectsState, tagsState);
    const booksCount = loaded ? data?.allBooks?.Meta?.count ?? "" : "";

    const resultsCount = booksCount != null ? booksCount : -1;
    const totalPages = resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0;

    return {
      currentQuery,
      books,
      resultsCount,
      totalPages,
      reload,
      booksLoading: loading,
      booksLoaded: loaded
    };
  });
};

const adjustBooks = (books, subjectsState, tagsState) => {
  let { subjectHash, subjectsLoaded } = subjectsState;
  let { tagHash, tagsLoaded } = tagsState;

  if (!subjectsLoaded || !tagsLoaded || !books) return [];

  return books.map((bookRaw: IBookDisplay) => {
    let result = { ...bookRaw };
    result.subjects = result.subjects ?? [];
    result.tags = result.tags ?? [];
    result.subjectObjects = result.subjects.map(s => subjectHash[s]).filter(s => s);
    result.tagObjects = result.tags.map(s => tagHash[s]).filter(s => s);
    result.authors = result.authors || [];

    let d = new Date(+result.dateAdded);
    result.dateAddedDisplay = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return result;
  });
};
