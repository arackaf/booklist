import { graphqlClient } from "util/graphql";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { useMemo } from "react";
import { useSuspenseQuery, buildQuery } from "micro-graphql-react";
import { syncResults, clearCache } from "util/graphqlCacheHelpers";

import { useTagsState } from "app/state/tagsState";
import { QueryOf, Queries } from "graphql-typings";
import { computeBookSearchVariables } from "./booksLoadingUtils";
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

graphqlClient.subscribeMutation({ when: /createBook/, run: () => clearCache(GetBooksQuery) });

window.addEventListener("book-scanned", () => graphqlClient.getCache(GetBooksQuery).clearCache());

export const useBooks = () => {
  const searchState = useCurrentSearch();
  const variables = useMemo(() => computeBookSearchVariables(searchState), [searchState]);
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
  const { data, loaded, currentQuery } = useSuspenseQuery<QueryOf<Queries["allBooks"]>>(
    buildQuery(GetBooksQuery, variables, { onMutation: onBooksMutation })
  );

  const booksRaw = data ? data.allBooks.Books : null;
  const books = adjustBooks(booksRaw);
  const booksCount = loaded ? data?.allBooks?.Meta?.count ?? "" : "";

  const resultsCount = booksCount != null ? booksCount : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    books,
    resultsCount,
    totalPages
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
