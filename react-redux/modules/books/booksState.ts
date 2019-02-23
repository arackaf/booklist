import { graphqlClient } from "applicationRoot/rootReducer";
import update from "immutability-helper";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { useMemo, useContext, createContext } from "react";
import { SubjectsContext, AppContext } from "applicationRoot/renderUI";
import { TagsContext } from "./components/bookViewList";
import { useQuery, buildQuery } from "micro-graphql-react";
import { syncResults, clearCache, syncDeletes } from "applicationRoot/graphqlHelpers";

import delve from "dlv";

const LOAD_BOOKS_RESULTS = "LOAD_BOOKS_RESULTS";
const SET_BOOKS_TAGS = "SET_BOOKS_TAGS";

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

const initialBooksState = {
  selectedBooks: {} as { [s: string]: boolean },
  resultsCount: 0,
  reloadOnActivate: false
};
export type BooksState = typeof initialBooksState & { booksHash: any };

export function booksReducer(state = initialBooksState, action): BooksState {
  switch (action.type) {
    case SET_BOOKS_TAGS: {
      let remove = new Set<string>(action.remove);
      return update(state, {
        booksHash: {
          ...action.books.reduce(
            (hash, _id) => (
              (hash[_id] = {
                tags: { $apply: currentTags => Array.from(new Set(currentTags.filter(t => !remove.has(t)).concat(action.add))) }
              }),
              hash
            ),
            {}
          )
        }
      });
    }
  }

  return state as any;
}

graphqlClient.subscribeMutation({ when: /createBook/, run: () => clearCache(GetBooksQuery) });

export const useBooks = () => {
  const [app] = useContext(AppContext);
  const searchState = useCurrentSearch();

  const variables = getBookSearchVariables(searchState, app.publicUserId, app.online);
  const onBooksMutation = [
    {
      when: /updateBooks?/,
      run: ({ currentResults, softReset }, resp) => {
        syncResults(currentResults.allBooks, "Books", resp.updateBooks ? resp.updateBooks.Books : [resp.updateBook.Book]);
        softReset(currentResults);
      }
    },
    {
      when: /deleteBook/,
      run: ({ refresh }, res, req) => {
        syncDeletes(GetBooksQuery, [req._id], "allBooks", "Books");
        refresh();
      }
    }
  ];
  const { data, loading, loaded, currentQuery } = useQuery(buildQuery(GetBooksQuery, variables, { onMutation: onBooksMutation }));

  const booksRaw = delve(data, "allBooks.Books") || null;
  const books = adjustBooks(booksRaw);
  const booksCount = delve(data, "allBooks.Meta.count") || null;

  const resultsCount = booksCount != null ? booksCount : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    books,
    resultsCount,
    totalPages,
    booksLoading: loading
  };
};

function getBookSearchVariables(bookSearchFilters, publicUserId, online) {
  return useMemo(() => {
    let getBooksVariables: any = {
      page: +bookSearchFilters.page,
      pageSize: bookSearchFilters.pageSize,
      sort: { [bookSearchFilters.sort]: bookSearchFilters.sortDirection == "asc" ? 1 : -1 },
      title_contains: bookSearchFilters.search || void 0,
      isRead: bookSearchFilters.isRead === "1" ? true : void 0,
      isRead_ne: bookSearchFilters.isRead === "0" ? true : void 0,
      subjects_containsAny: bookSearchFilters.subjectIds.length ? bookSearchFilters.subjectIds : void 0,
      searchChildSubjects: bookSearchFilters.searchChildSubjects == "true" ? true : void 0,
      tags_containsAny: bookSearchFilters.tagIds.length ? bookSearchFilters.tagIds : void 0,
      authors_textContains: bookSearchFilters.author || void 0,
      publisher_contains: bookSearchFilters.publisher || void 0,
      publicUserId: publicUserId,
      subjects_count: bookSearchFilters.noSubjects ? 0 : void 0,
      cache: online ? 1 : void 0
    };

    if (bookSearchFilters.pages != "" && bookSearchFilters.pages != null) {
      getBooksVariables[bookSearchFilters.pagesOperator == "lt" ? "pages_lt" : "pages_gt"] = +bookSearchFilters.pages;
    }

    return getBooksVariables;
  }, [bookSearchFilters, publicUserId]);
}

const booksResults = (resp, count) => ({ type: LOAD_BOOKS_RESULTS, books: resp.results, resultsCount: count });
export const BooksContext = createContext<ReturnType<typeof useBooks>>(null);

const adjustBooks = books => {
  let { subjectHash, subjectsLoaded } = useContext(SubjectsContext);
  let [{ tagHash, tagsLoaded }] = useContext(TagsContext);

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
