import { useMemo, useLayoutEffect, createContext } from "react";
import { graphqlClient } from "util/graphql";

import GetBooksQuery from "graphql/books/getBooks.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { useSuspenseQuery } from "micro-graphql-react";
import { clearCache, syncCollection } from "util/graphqlCacheHelpers";

import { useTagsState } from "app/state/tagsState";
import { QueryOf, Queries } from "graphql/graphql-typings";
import { computeBookSearchVariables } from "./bookFiltersToGraphqlArgs";
import { useSubjectsState } from "app/state/subjectsState";

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
  smallImagePreview: string;
  mobileImage: string;
  mobileImagePreview: string;
  mediumImage: string;
  mediumImagePreview: string;
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

  window.removeEventListener("ws-info", handleWs);
}

function booksInactive() {
  createSubscription = graphqlClient.subscribeMutation({ when: /createBook/, run: () => clearCache(GetBooksQuery) });

  window.addEventListener("ws-info", handleWs);
}

function handleWs(evt) {
  if (evt?.detail?.type == "scanResults") {
    clearCache(GetBooksQuery);
  }
}

export const useBooks = () => {
  const searchState = useCurrentSearch();
  const variables = useMemo(() => computeBookSearchVariables(searchState), [searchState]);
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
      run: ({ softReset, currentResults, refresh }, res, req) => {
        let toRemove = currentResults.allBooks.Books.find(b => b._id == req._id);
        if (toRemove) {
          currentResults.allBooks.Books = currentResults.allBooks.Books.filter(b => b != toRemove);
          currentResults.allBooks.Meta.count--;
        }

        softReset(currentResults);
      }
    }
  ];
  const { data, loaded, currentQuery, reload, softReset } = useSuspenseQuery<QueryOf<Queries["allBooks"]>>(GetBooksQuery, variables, {
    preloadOnly: true,
    onMutation: onBooksMutation
  });

  useLayoutEffect(() => {
    function handleWs(evt) {
      if (evt?.detail?.type == "bookAdded") {
        softReset();
      }
    }
    window.addEventListener("ws-info", handleWs);
    booksActive();
    return () => {
      booksInactive();
      window.removeEventListener("ws-info", handleWs);
    };
  }, []);

  const booksRaw = data ? data.allBooks.Books : null;
  const books = adjustBooks(booksRaw);
  const booksCount = loaded ? data?.allBooks?.Meta?.count ?? "" : "";

  const resultsCount = booksCount != null ? booksCount : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    books,
    resultsCount,
    totalPages,
    reload,
    booksLoaded: loaded
  };
};

const adjustBooks = books => {
  let { subjectHash, subjectsLoaded } = useSubjectsState();
  let { tagHash, tagsLoaded } = useTagsState();

  return useMemo(() => {
    if (!subjectsLoaded || !tagsLoaded || !books) return [];

    return books.map((bookRaw: IBookDisplay) => {
      let result = { ...bookRaw };
      result.subjectObjects = (result.subjects || []).map(s => subjectHash[s]).filter(s => s);
      result.tagObjects = (result.tags || []).map(s => tagHash[s]).filter(s => s);
      result.authors = result.authors || [];

      let d = new Date(+result.dateAdded);
      result.dateAddedDisplay = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      return result;
    });
  }, [books, subjectHash, tagHash, subjectsLoaded, tagsLoaded]);
};

export type BooksModuleActions = {
  editBook: any;
  saveEditingBook: any;
  openBookSubModal: any;
  openBookTagModal: any;
  editTags: any;
  editSubjects: any;
  beginEditFilters: any;
  setRead: any;
  runDelete: any;
};

export type BooksModuleData = {
  actions: BooksModuleActions;
  booksUiState: typeof initialBooksState;
  dispatchBooksUiState: any;
};

export const BooksModuleContext = createContext<BooksModuleData>(null);

export const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };
