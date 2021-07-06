export type Queries = { [K in keyof Query]: K };
export type Mutations = { [K in keyof Mutation]: K };

type EitherType<T, QueryOrMutation> = [T] extends [keyof QueryOrMutation]
  ? keyof QueryOrMutation
  : [T] extends [Record<string, keyof QueryOrMutation>]
  ? Record<string, keyof QueryOrMutation>
  : never;

type GetType<T, QueryOrMutation> = [T] extends [keyof QueryOrMutation]
  ? Pick<QueryOrMutation, T>
  : [T] extends [Record<string, keyof QueryOrMutation>]
  ? { [k in keyof T]: QueryOrMutation[T[k]] }
  : never;

export type QueryOf<T extends EitherType<T, Query>, U extends EitherType<U, Query> = never> = GetType<T, Query> & GetType<U, Query>;
export type MutationOf<T extends EitherType<T, Mutation>, U extends EitherType<U, Mutation> = never> = GetType<T, Mutation> & GetType<U, Mutation>;

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};


export type DeletionResultInfo = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type MutationResultInfo = {
  transaction: Scalars['Boolean'];
  elapsedTime: Scalars['Int'];
};

export type QueryResultsMetadata = {
  count: Scalars['Int'];
};

export type QueryRelationshipResultsMetadata = {
  count: Scalars['Int'];
};

export type StringArrayUpdate = {
  index: Scalars['Int'];
  value: Scalars['String'];
};

export type IntArrayUpdate = {
  index: Scalars['Int'];
  value: Scalars['Int'];
};

export type FloatArrayUpdate = {
  index: Scalars['Int'];
  value: Scalars['Float'];
};

export type Book = {
  _id: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  publisher: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['String']>;
  pages: Maybe<Scalars['Int']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects: Maybe<Array<Maybe<Scalars['String']>>>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  isRead: Maybe<Scalars['Boolean']>;
  dateAdded: Maybe<Scalars['String']>;
  editorialReviews: Maybe<Array<Maybe<EditorialReview>>>;
  similarItems: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Float']>;
  similarBooks: Array<BookSummary>;
  similarBooksMeta: Maybe<QueryRelationshipResultsMetadata>;
};


export type BookSimilarBooksArgs = {
  FILTER: Maybe<BookSummaryFilters>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
  SORT: Maybe<BookSummarySort>;
  SORTS: Maybe<Array<Maybe<BookSummarySort>>>;
  PREFER_LOOKUP: Maybe<Scalars['Boolean']>;
  DONT_PREFER_LOOKUP: Maybe<Scalars['Boolean']>;
};


export type BookSimilarBooksMetaArgs = {
  FILTER: Maybe<BookSummaryFilters>;
};

export type BookQueryResults = {
  Books: Array<Book>;
  Meta: QueryResultsMetadata;
};

export type BookSingleQueryResult = {
  Book: Maybe<Book>;
};

export type BookMutationResult = {
  Book: Maybe<Book>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookMutationResultMulti = {
  Books: Maybe<Array<Maybe<Book>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookInput = {
  _id: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  publisher: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['String']>;
  pages: Maybe<Scalars['Int']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects: Maybe<Array<Maybe<Scalars['String']>>>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  isRead: Maybe<Scalars['Boolean']>;
  dateAdded: Maybe<Scalars['String']>;
  editorialReviews: Maybe<Array<Maybe<EditorialReviewInput>>>;
  similarItems: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Float']>;
  similarBooks: Maybe<Array<Maybe<BookSummaryInput>>>;
};

export type BookMutationInput = {
  ean: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  publisher: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['String']>;
  pages: Maybe<Scalars['Int']>;
  pages_INC: Maybe<Scalars['Int']>;
  pages_DEC: Maybe<Scalars['Int']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_PUSH: Maybe<Scalars['String']>;
  authors_CONCAT: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_UPDATE: Maybe<StringArrayUpdate>;
  authors_UPDATES: Maybe<Array<Maybe<StringArrayUpdate>>>;
  authors_PULL: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ADDTOSET: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_PUSH: Maybe<Scalars['String']>;
  subjects_CONCAT: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_UPDATE: Maybe<StringArrayUpdate>;
  subjects_UPDATES: Maybe<Array<Maybe<StringArrayUpdate>>>;
  subjects_PULL: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_ADDTOSET: Maybe<Array<Maybe<Scalars['String']>>>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_PUSH: Maybe<Scalars['String']>;
  tags_CONCAT: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_UPDATE: Maybe<StringArrayUpdate>;
  tags_UPDATES: Maybe<Array<Maybe<StringArrayUpdate>>>;
  tags_PULL: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_ADDTOSET: Maybe<Array<Maybe<Scalars['String']>>>;
  isRead: Maybe<Scalars['Boolean']>;
  dateAdded: Maybe<Scalars['String']>;
  editorialReviews: Maybe<Array<Maybe<EditorialReviewInput>>>;
  editorialReviews_PUSH: Maybe<EditorialReviewInput>;
  editorialReviews_CONCAT: Maybe<Array<Maybe<EditorialReviewInput>>>;
  editorialReviews_UPDATE: Maybe<EditorialReviewArrayMutationInput>;
  editorialReviews_UPDATES: Maybe<Array<Maybe<EditorialReviewArrayMutationInput>>>;
  editorialReviews_PULL: Maybe<EditorialReviewFilters>;
  similarItems: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_PUSH: Maybe<Scalars['String']>;
  similarItems_CONCAT: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_UPDATE: Maybe<StringArrayUpdate>;
  similarItems_UPDATES: Maybe<Array<Maybe<StringArrayUpdate>>>;
  similarItems_PULL: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_ADDTOSET: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_INC: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_DEC: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_INC: Maybe<Scalars['Int']>;
  timestamp_DEC: Maybe<Scalars['Int']>;
  similarBooks_ADD: Maybe<Array<Maybe<BookSummaryInput>>>;
};

export type BookSort = {
  _id: Maybe<Scalars['Int']>;
  ean: Maybe<Scalars['Int']>;
  isbn: Maybe<Scalars['Int']>;
  title: Maybe<Scalars['Int']>;
  smallImage: Maybe<Scalars['Int']>;
  mediumImage: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  publisher: Maybe<Scalars['Int']>;
  publicationDate: Maybe<Scalars['Int']>;
  pages: Maybe<Scalars['Int']>;
  authors: Maybe<Scalars['Int']>;
  subjects: Maybe<Scalars['Int']>;
  tags: Maybe<Scalars['Int']>;
  isRead: Maybe<Scalars['Int']>;
  dateAdded: Maybe<Scalars['Int']>;
  editorialReviews: Maybe<Scalars['Int']>;
  similarItems: Maybe<Scalars['Int']>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Int']>;
};

export type BookFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_contains: Maybe<Scalars['String']>;
  ean_startsWith: Maybe<Scalars['String']>;
  ean_endsWith: Maybe<Scalars['String']>;
  ean_regex: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  ean_ne: Maybe<Scalars['String']>;
  ean_in: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_contains: Maybe<Scalars['String']>;
  isbn_startsWith: Maybe<Scalars['String']>;
  isbn_endsWith: Maybe<Scalars['String']>;
  isbn_regex: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  isbn_ne: Maybe<Scalars['String']>;
  isbn_in: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  title_contains: Maybe<Scalars['String']>;
  title_startsWith: Maybe<Scalars['String']>;
  title_endsWith: Maybe<Scalars['String']>;
  title_regex: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  title_ne: Maybe<Scalars['String']>;
  title_in: Maybe<Array<Maybe<Scalars['String']>>>;
  title_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_contains: Maybe<Scalars['String']>;
  smallImage_startsWith: Maybe<Scalars['String']>;
  smallImage_endsWith: Maybe<Scalars['String']>;
  smallImage_regex: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  smallImage_ne: Maybe<Scalars['String']>;
  smallImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_contains: Maybe<Scalars['String']>;
  mediumImage_startsWith: Maybe<Scalars['String']>;
  mediumImage_endsWith: Maybe<Scalars['String']>;
  mediumImage_regex: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImage_ne: Maybe<Scalars['String']>;
  mediumImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  publisher_contains: Maybe<Scalars['String']>;
  publisher_startsWith: Maybe<Scalars['String']>;
  publisher_endsWith: Maybe<Scalars['String']>;
  publisher_regex: Maybe<Scalars['String']>;
  publisher: Maybe<Scalars['String']>;
  publisher_ne: Maybe<Scalars['String']>;
  publisher_in: Maybe<Array<Maybe<Scalars['String']>>>;
  publisher_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  publicationDate_contains: Maybe<Scalars['String']>;
  publicationDate_startsWith: Maybe<Scalars['String']>;
  publicationDate_endsWith: Maybe<Scalars['String']>;
  publicationDate_regex: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['String']>;
  publicationDate_ne: Maybe<Scalars['String']>;
  publicationDate_in: Maybe<Array<Maybe<Scalars['String']>>>;
  publicationDate_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  pages_lt: Maybe<Scalars['Int']>;
  pages_lte: Maybe<Scalars['Int']>;
  pages_gt: Maybe<Scalars['Int']>;
  pages_gte: Maybe<Scalars['Int']>;
  pages: Maybe<Scalars['Int']>;
  pages_ne: Maybe<Scalars['Int']>;
  pages_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  pages_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  authors_count: Maybe<Scalars['Int']>;
  authors_textContains: Maybe<Scalars['String']>;
  authors_startsWith: Maybe<Scalars['String']>;
  authors_endsWith: Maybe<Scalars['String']>;
  authors_regex: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_contains: Maybe<Scalars['String']>;
  authors_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_count: Maybe<Scalars['Int']>;
  subjects_textContains: Maybe<Scalars['String']>;
  subjects_startsWith: Maybe<Scalars['String']>;
  subjects_endsWith: Maybe<Scalars['String']>;
  subjects_regex: Maybe<Scalars['String']>;
  subjects: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  subjects_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  subjects_contains: Maybe<Scalars['String']>;
  subjects_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_count: Maybe<Scalars['Int']>;
  tags_textContains: Maybe<Scalars['String']>;
  tags_startsWith: Maybe<Scalars['String']>;
  tags_endsWith: Maybe<Scalars['String']>;
  tags_regex: Maybe<Scalars['String']>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  tags_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  tags_contains: Maybe<Scalars['String']>;
  tags_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  isRead: Maybe<Scalars['Boolean']>;
  isRead_ne: Maybe<Scalars['Boolean']>;
  isRead_in: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  isRead_nin: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  dateAdded_contains: Maybe<Scalars['String']>;
  dateAdded_startsWith: Maybe<Scalars['String']>;
  dateAdded_endsWith: Maybe<Scalars['String']>;
  dateAdded_regex: Maybe<Scalars['String']>;
  dateAdded: Maybe<Scalars['String']>;
  dateAdded_ne: Maybe<Scalars['String']>;
  dateAdded_in: Maybe<Array<Maybe<Scalars['String']>>>;
  dateAdded_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  editorialReviews_count: Maybe<Scalars['Int']>;
  editorialReviews: Maybe<EditorialReviewFilters>;
  similarItems_count: Maybe<Scalars['Int']>;
  similarItems_textContains: Maybe<Scalars['String']>;
  similarItems_startsWith: Maybe<Scalars['String']>;
  similarItems_endsWith: Maybe<Scalars['String']>;
  similarItems_regex: Maybe<Scalars['String']>;
  similarItems: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  similarItems_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  similarItems_contains: Maybe<Scalars['String']>;
  similarItems_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItemsLastUpdate_lt: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_lte: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_gt: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_gte: Maybe<Scalars['Int']>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_ne: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  similarItemsLastUpdate_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<BookFilters>>>;
};

export type BookSummary = {
  _id: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BookSummaryQueryResults = {
  BookSummarys: Array<BookSummary>;
  Meta: QueryResultsMetadata;
};

export type BookSummarySingleQueryResult = {
  BookSummary: Maybe<BookSummary>;
};

export type BookSummaryMutationResult = {
  BookSummary: Maybe<BookSummary>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookSummaryMutationResultMulti = {
  BookSummarys: Maybe<Array<Maybe<BookSummary>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookSummaryBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BookSummaryInput = {
  _id: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BookSummaryMutationInput = {
  title: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_PUSH: Maybe<Scalars['String']>;
  authors_CONCAT: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_UPDATE: Maybe<StringArrayUpdate>;
  authors_UPDATES: Maybe<Array<Maybe<StringArrayUpdate>>>;
  authors_PULL: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ADDTOSET: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BookSummarySort = {
  _id: Maybe<Scalars['Int']>;
  title: Maybe<Scalars['Int']>;
  asin: Maybe<Scalars['Int']>;
  isbn: Maybe<Scalars['Int']>;
  ean: Maybe<Scalars['Int']>;
  smallImage: Maybe<Scalars['Int']>;
  mediumImage: Maybe<Scalars['Int']>;
  authors: Maybe<Scalars['Int']>;
};

export type BookSummaryFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  title_contains: Maybe<Scalars['String']>;
  title_startsWith: Maybe<Scalars['String']>;
  title_endsWith: Maybe<Scalars['String']>;
  title_regex: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  title_ne: Maybe<Scalars['String']>;
  title_in: Maybe<Array<Maybe<Scalars['String']>>>;
  title_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  asin_contains: Maybe<Scalars['String']>;
  asin_startsWith: Maybe<Scalars['String']>;
  asin_endsWith: Maybe<Scalars['String']>;
  asin_regex: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  asin_ne: Maybe<Scalars['String']>;
  asin_in: Maybe<Array<Maybe<Scalars['String']>>>;
  asin_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_contains: Maybe<Scalars['String']>;
  isbn_startsWith: Maybe<Scalars['String']>;
  isbn_endsWith: Maybe<Scalars['String']>;
  isbn_regex: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  isbn_ne: Maybe<Scalars['String']>;
  isbn_in: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_contains: Maybe<Scalars['String']>;
  ean_startsWith: Maybe<Scalars['String']>;
  ean_endsWith: Maybe<Scalars['String']>;
  ean_regex: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  ean_ne: Maybe<Scalars['String']>;
  ean_in: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_contains: Maybe<Scalars['String']>;
  smallImage_startsWith: Maybe<Scalars['String']>;
  smallImage_endsWith: Maybe<Scalars['String']>;
  smallImage_regex: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  smallImage_ne: Maybe<Scalars['String']>;
  smallImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_contains: Maybe<Scalars['String']>;
  mediumImage_startsWith: Maybe<Scalars['String']>;
  mediumImage_endsWith: Maybe<Scalars['String']>;
  mediumImage_regex: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImage_ne: Maybe<Scalars['String']>;
  mediumImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_count: Maybe<Scalars['Int']>;
  authors_textContains: Maybe<Scalars['String']>;
  authors_startsWith: Maybe<Scalars['String']>;
  authors_endsWith: Maybe<Scalars['String']>;
  authors_regex: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_contains: Maybe<Scalars['String']>;
  authors_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  OR: Maybe<Array<Maybe<BookSummaryFilters>>>;
};

export type BooksDeleted = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type BooksDeletedQueryResults = {
  BooksDeleteds: Array<BooksDeleted>;
  Meta: QueryResultsMetadata;
};

export type BooksDeletedSingleQueryResult = {
  BooksDeleted: Maybe<BooksDeleted>;
};

export type BooksDeletedMutationResult = {
  BooksDeleted: Maybe<BooksDeleted>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BooksDeletedMutationResultMulti = {
  BooksDeleteds: Maybe<Array<Maybe<BooksDeleted>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BooksDeletedBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type BooksDeletedInput = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type BooksDeletedMutationInput = {
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_INC: Maybe<Scalars['Int']>;
  deletedTimestamp_DEC: Maybe<Scalars['Int']>;
};

export type BooksDeletedSort = {
  _id: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  deletedTimestamp: Maybe<Scalars['Int']>;
};

export type BooksDeletedFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<BooksDeletedFilters>>>;
};

export type EditorialReview = {
  source: Maybe<Scalars['String']>;
  content: Maybe<Scalars['String']>;
};

export type EditorialReviewInput = {
  source: Maybe<Scalars['String']>;
  content: Maybe<Scalars['String']>;
};

export type EditorialReviewMutationInput = {
  source: Maybe<Scalars['String']>;
  content: Maybe<Scalars['String']>;
};

export type EditorialReviewArrayMutationInput = {
  index: Maybe<Scalars['Int']>;
  Updates: Maybe<EditorialReviewMutationInput>;
};

export type EditorialReviewSort = {
  source: Maybe<Scalars['Int']>;
  content: Maybe<Scalars['Int']>;
};

export type EditorialReviewFilters = {
  source_contains: Maybe<Scalars['String']>;
  source_startsWith: Maybe<Scalars['String']>;
  source_endsWith: Maybe<Scalars['String']>;
  source_regex: Maybe<Scalars['String']>;
  source: Maybe<Scalars['String']>;
  source_ne: Maybe<Scalars['String']>;
  source_in: Maybe<Array<Maybe<Scalars['String']>>>;
  source_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  content_contains: Maybe<Scalars['String']>;
  content_startsWith: Maybe<Scalars['String']>;
  content_endsWith: Maybe<Scalars['String']>;
  content_regex: Maybe<Scalars['String']>;
  content: Maybe<Scalars['String']>;
  content_ne: Maybe<Scalars['String']>;
  content_in: Maybe<Array<Maybe<Scalars['String']>>>;
  content_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  OR: Maybe<Array<Maybe<EditorialReviewFilters>>>;
};

export type LabelColor = {
  _id: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  order: Maybe<Scalars['Int']>;
};

export type LabelColorQueryResults = {
  LabelColors: Array<LabelColor>;
  Meta: QueryResultsMetadata;
};

export type LabelColorSingleQueryResult = {
  LabelColor: Maybe<LabelColor>;
};

export type LabelColorMutationResult = {
  LabelColor: Maybe<LabelColor>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type LabelColorMutationResultMulti = {
  LabelColors: Maybe<Array<Maybe<LabelColor>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type LabelColorBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type LabelColorInput = {
  _id: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  order: Maybe<Scalars['Int']>;
};

export type LabelColorMutationInput = {
  backgroundColor: Maybe<Scalars['String']>;
  order: Maybe<Scalars['Int']>;
  order_INC: Maybe<Scalars['Int']>;
  order_DEC: Maybe<Scalars['Int']>;
};

export type LabelColorSort = {
  _id: Maybe<Scalars['Int']>;
  backgroundColor: Maybe<Scalars['Int']>;
  order: Maybe<Scalars['Int']>;
};

export type LabelColorFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  order_lt: Maybe<Scalars['Int']>;
  order_lte: Maybe<Scalars['Int']>;
  order_gt: Maybe<Scalars['Int']>;
  order_gte: Maybe<Scalars['Int']>;
  order: Maybe<Scalars['Int']>;
  order_ne: Maybe<Scalars['Int']>;
  order_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  order_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  OR: Maybe<Array<Maybe<LabelColorFilters>>>;
};

export type Subject = {
  _id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
};

export type SubjectQueryResults = {
  Subjects: Array<Subject>;
  Meta: QueryResultsMetadata;
};

export type SubjectSingleQueryResult = {
  Subject: Maybe<Subject>;
};

export type SubjectMutationResult = {
  Subject: Maybe<Subject>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectMutationResultMulti = {
  Subjects: Maybe<Array<Maybe<Subject>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectInput = {
  _id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
};

export type SubjectMutationInput = {
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_INC: Maybe<Scalars['Int']>;
  timestamp_DEC: Maybe<Scalars['Int']>;
};

export type SubjectSort = {
  _id: Maybe<Scalars['Int']>;
  name: Maybe<Scalars['Int']>;
  path: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  backgroundColor: Maybe<Scalars['Int']>;
  textColor: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Int']>;
};

export type SubjectFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  name_contains: Maybe<Scalars['String']>;
  name_startsWith: Maybe<Scalars['String']>;
  name_endsWith: Maybe<Scalars['String']>;
  name_regex: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  name_ne: Maybe<Scalars['String']>;
  name_in: Maybe<Array<Maybe<Scalars['String']>>>;
  name_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  path_contains: Maybe<Scalars['String']>;
  path_startsWith: Maybe<Scalars['String']>;
  path_endsWith: Maybe<Scalars['String']>;
  path_regex: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  path_ne: Maybe<Scalars['String']>;
  path_in: Maybe<Array<Maybe<Scalars['String']>>>;
  path_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_contains: Maybe<Scalars['String']>;
  textColor_startsWith: Maybe<Scalars['String']>;
  textColor_endsWith: Maybe<Scalars['String']>;
  textColor_regex: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  textColor_ne: Maybe<Scalars['String']>;
  textColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<SubjectFilters>>>;
};

export type SubjectsDeleted = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type SubjectsDeletedQueryResults = {
  SubjectsDeleteds: Array<SubjectsDeleted>;
  Meta: QueryResultsMetadata;
};

export type SubjectsDeletedSingleQueryResult = {
  SubjectsDeleted: Maybe<SubjectsDeleted>;
};

export type SubjectsDeletedMutationResult = {
  SubjectsDeleted: Maybe<SubjectsDeleted>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectsDeletedMutationResultMulti = {
  SubjectsDeleteds: Maybe<Array<Maybe<SubjectsDeleted>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectsDeletedBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type SubjectsDeletedInput = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type SubjectsDeletedMutationInput = {
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_INC: Maybe<Scalars['Int']>;
  deletedTimestamp_DEC: Maybe<Scalars['Int']>;
};

export type SubjectsDeletedSort = {
  _id: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  deletedTimestamp: Maybe<Scalars['Int']>;
};

export type SubjectsDeletedFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<SubjectsDeletedFilters>>>;
};

export type Tag = {
  _id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
};

export type TagQueryResults = {
  Tags: Array<Tag>;
  Meta: QueryResultsMetadata;
};

export type TagSingleQueryResult = {
  Tag: Maybe<Tag>;
};

export type TagMutationResult = {
  Tag: Maybe<Tag>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagMutationResultMulti = {
  Tags: Maybe<Array<Maybe<Tag>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagInput = {
  _id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
};

export type TagMutationInput = {
  name: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_INC: Maybe<Scalars['Int']>;
  timestamp_DEC: Maybe<Scalars['Int']>;
};

export type TagSort = {
  _id: Maybe<Scalars['Int']>;
  name: Maybe<Scalars['Int']>;
  path: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  backgroundColor: Maybe<Scalars['Int']>;
  textColor: Maybe<Scalars['Int']>;
  timestamp: Maybe<Scalars['Int']>;
};

export type TagFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  name_contains: Maybe<Scalars['String']>;
  name_startsWith: Maybe<Scalars['String']>;
  name_endsWith: Maybe<Scalars['String']>;
  name_regex: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  name_ne: Maybe<Scalars['String']>;
  name_in: Maybe<Array<Maybe<Scalars['String']>>>;
  name_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  path_contains: Maybe<Scalars['String']>;
  path_startsWith: Maybe<Scalars['String']>;
  path_endsWith: Maybe<Scalars['String']>;
  path_regex: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  path_ne: Maybe<Scalars['String']>;
  path_in: Maybe<Array<Maybe<Scalars['String']>>>;
  path_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_contains: Maybe<Scalars['String']>;
  textColor_startsWith: Maybe<Scalars['String']>;
  textColor_endsWith: Maybe<Scalars['String']>;
  textColor_regex: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  textColor_ne: Maybe<Scalars['String']>;
  textColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<TagFilters>>>;
};

export type TagsDeleted = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type TagsDeletedQueryResults = {
  TagsDeleteds: Array<TagsDeleted>;
  Meta: QueryResultsMetadata;
};

export type TagsDeletedSingleQueryResult = {
  TagsDeleted: Maybe<TagsDeleted>;
};

export type TagsDeletedMutationResult = {
  TagsDeleted: Maybe<TagsDeleted>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagsDeletedMutationResultMulti = {
  TagsDeleteds: Maybe<Array<Maybe<TagsDeleted>>>;
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagsDeletedBulkMutationResult = {
  success: Scalars['Boolean'];
  Meta: MutationResultInfo;
};

export type TagsDeletedInput = {
  _id: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
};

export type TagsDeletedMutationInput = {
  userId: Maybe<Scalars['String']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_INC: Maybe<Scalars['Int']>;
  deletedTimestamp_DEC: Maybe<Scalars['Int']>;
};

export type TagsDeletedSort = {
  _id: Maybe<Scalars['Int']>;
  userId: Maybe<Scalars['Int']>;
  deletedTimestamp: Maybe<Scalars['Int']>;
};

export type TagsDeletedFilters = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<TagsDeletedFilters>>>;
};

export type Query = {
  allBooks: BookQueryResults;
  getBook: BookSingleQueryResult;
  allBookSummarys: BookSummaryQueryResults;
  getBookSummary: BookSummarySingleQueryResult;
  allBooksDeleteds: BooksDeletedQueryResults;
  getBooksDeleted: BooksDeletedSingleQueryResult;
  allLabelColors: LabelColorQueryResults;
  allSubjects: SubjectQueryResults;
  getSubject: SubjectSingleQueryResult;
  allSubjectsDeleteds: SubjectsDeletedQueryResults;
  getSubjectsDeleted: SubjectsDeletedSingleQueryResult;
  allTags: TagQueryResults;
  getTag: TagSingleQueryResult;
  allTagsDeleteds: TagsDeletedQueryResults;
  getTagsDeleted: TagsDeletedSingleQueryResult;
  getUser: Maybe<UserSingleQueryResult>;
  getPublicUser: Maybe<PublicUserSingleQueryResult>;
};


export type QueryAllBooksArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_contains: Maybe<Scalars['String']>;
  ean_startsWith: Maybe<Scalars['String']>;
  ean_endsWith: Maybe<Scalars['String']>;
  ean_regex: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  ean_ne: Maybe<Scalars['String']>;
  ean_in: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_contains: Maybe<Scalars['String']>;
  isbn_startsWith: Maybe<Scalars['String']>;
  isbn_endsWith: Maybe<Scalars['String']>;
  isbn_regex: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  isbn_ne: Maybe<Scalars['String']>;
  isbn_in: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  title_contains: Maybe<Scalars['String']>;
  title_startsWith: Maybe<Scalars['String']>;
  title_endsWith: Maybe<Scalars['String']>;
  title_regex: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  title_ne: Maybe<Scalars['String']>;
  title_in: Maybe<Array<Maybe<Scalars['String']>>>;
  title_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_contains: Maybe<Scalars['String']>;
  smallImage_startsWith: Maybe<Scalars['String']>;
  smallImage_endsWith: Maybe<Scalars['String']>;
  smallImage_regex: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  smallImage_ne: Maybe<Scalars['String']>;
  smallImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_contains: Maybe<Scalars['String']>;
  mediumImage_startsWith: Maybe<Scalars['String']>;
  mediumImage_endsWith: Maybe<Scalars['String']>;
  mediumImage_regex: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImage_ne: Maybe<Scalars['String']>;
  mediumImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  publisher_contains: Maybe<Scalars['String']>;
  publisher_startsWith: Maybe<Scalars['String']>;
  publisher_endsWith: Maybe<Scalars['String']>;
  publisher_regex: Maybe<Scalars['String']>;
  publisher: Maybe<Scalars['String']>;
  publisher_ne: Maybe<Scalars['String']>;
  publisher_in: Maybe<Array<Maybe<Scalars['String']>>>;
  publisher_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  publicationDate_contains: Maybe<Scalars['String']>;
  publicationDate_startsWith: Maybe<Scalars['String']>;
  publicationDate_endsWith: Maybe<Scalars['String']>;
  publicationDate_regex: Maybe<Scalars['String']>;
  publicationDate: Maybe<Scalars['String']>;
  publicationDate_ne: Maybe<Scalars['String']>;
  publicationDate_in: Maybe<Array<Maybe<Scalars['String']>>>;
  publicationDate_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  pages_lt: Maybe<Scalars['Int']>;
  pages_lte: Maybe<Scalars['Int']>;
  pages_gt: Maybe<Scalars['Int']>;
  pages_gte: Maybe<Scalars['Int']>;
  pages: Maybe<Scalars['Int']>;
  pages_ne: Maybe<Scalars['Int']>;
  pages_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  pages_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  authors_count: Maybe<Scalars['Int']>;
  authors_textContains: Maybe<Scalars['String']>;
  authors_startsWith: Maybe<Scalars['String']>;
  authors_endsWith: Maybe<Scalars['String']>;
  authors_regex: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_contains: Maybe<Scalars['String']>;
  authors_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_count: Maybe<Scalars['Int']>;
  subjects_textContains: Maybe<Scalars['String']>;
  subjects_startsWith: Maybe<Scalars['String']>;
  subjects_endsWith: Maybe<Scalars['String']>;
  subjects_regex: Maybe<Scalars['String']>;
  subjects: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  subjects_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  subjects_contains: Maybe<Scalars['String']>;
  subjects_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  subjects_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_count: Maybe<Scalars['Int']>;
  tags_textContains: Maybe<Scalars['String']>;
  tags_startsWith: Maybe<Scalars['String']>;
  tags_endsWith: Maybe<Scalars['String']>;
  tags_regex: Maybe<Scalars['String']>;
  tags: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  tags_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  tags_contains: Maybe<Scalars['String']>;
  tags_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  tags_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  isRead: Maybe<Scalars['Boolean']>;
  isRead_ne: Maybe<Scalars['Boolean']>;
  isRead_in: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  isRead_nin: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  dateAdded_contains: Maybe<Scalars['String']>;
  dateAdded_startsWith: Maybe<Scalars['String']>;
  dateAdded_endsWith: Maybe<Scalars['String']>;
  dateAdded_regex: Maybe<Scalars['String']>;
  dateAdded: Maybe<Scalars['String']>;
  dateAdded_ne: Maybe<Scalars['String']>;
  dateAdded_in: Maybe<Array<Maybe<Scalars['String']>>>;
  dateAdded_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  editorialReviews_count: Maybe<Scalars['Int']>;
  editorialReviews: Maybe<EditorialReviewFilters>;
  similarItems_count: Maybe<Scalars['Int']>;
  similarItems_textContains: Maybe<Scalars['String']>;
  similarItems_startsWith: Maybe<Scalars['String']>;
  similarItems_endsWith: Maybe<Scalars['String']>;
  similarItems_regex: Maybe<Scalars['String']>;
  similarItems: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  similarItems_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  similarItems_contains: Maybe<Scalars['String']>;
  similarItems_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItems_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  similarItemsLastUpdate_lt: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_lte: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_gt: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_gte: Maybe<Scalars['Int']>;
  similarItemsLastUpdate: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_ne: Maybe<Scalars['Int']>;
  similarItemsLastUpdate_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  similarItemsLastUpdate_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<BookFilters>>>;
  SORT: Maybe<BookSort>;
  SORTS: Maybe<Array<Maybe<BookSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
  searchChildSubjects: Maybe<Scalars['Boolean']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryGetBookArgs = {
  _id: Maybe<Scalars['String']>;
  searchChildSubjects: Maybe<Scalars['Boolean']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryAllBookSummarysArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  title_contains: Maybe<Scalars['String']>;
  title_startsWith: Maybe<Scalars['String']>;
  title_endsWith: Maybe<Scalars['String']>;
  title_regex: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  title_ne: Maybe<Scalars['String']>;
  title_in: Maybe<Array<Maybe<Scalars['String']>>>;
  title_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  asin_contains: Maybe<Scalars['String']>;
  asin_startsWith: Maybe<Scalars['String']>;
  asin_endsWith: Maybe<Scalars['String']>;
  asin_regex: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  asin_ne: Maybe<Scalars['String']>;
  asin_in: Maybe<Array<Maybe<Scalars['String']>>>;
  asin_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_contains: Maybe<Scalars['String']>;
  isbn_startsWith: Maybe<Scalars['String']>;
  isbn_endsWith: Maybe<Scalars['String']>;
  isbn_regex: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  isbn_ne: Maybe<Scalars['String']>;
  isbn_in: Maybe<Array<Maybe<Scalars['String']>>>;
  isbn_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_contains: Maybe<Scalars['String']>;
  ean_startsWith: Maybe<Scalars['String']>;
  ean_endsWith: Maybe<Scalars['String']>;
  ean_regex: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  ean_ne: Maybe<Scalars['String']>;
  ean_in: Maybe<Array<Maybe<Scalars['String']>>>;
  ean_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_contains: Maybe<Scalars['String']>;
  smallImage_startsWith: Maybe<Scalars['String']>;
  smallImage_endsWith: Maybe<Scalars['String']>;
  smallImage_regex: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  smallImage_ne: Maybe<Scalars['String']>;
  smallImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  smallImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_contains: Maybe<Scalars['String']>;
  mediumImage_startsWith: Maybe<Scalars['String']>;
  mediumImage_endsWith: Maybe<Scalars['String']>;
  mediumImage_regex: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImage_ne: Maybe<Scalars['String']>;
  mediumImage_in: Maybe<Array<Maybe<Scalars['String']>>>;
  mediumImage_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_count: Maybe<Scalars['Int']>;
  authors_textContains: Maybe<Scalars['String']>;
  authors_startsWith: Maybe<Scalars['String']>;
  authors_endsWith: Maybe<Scalars['String']>;
  authors_regex: Maybe<Scalars['String']>;
  authors: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_in: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_nin: Maybe<Array<Maybe<Array<Maybe<Scalars['String']>>>>>;
  authors_contains: Maybe<Scalars['String']>;
  authors_containsAny: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_containsAll: Maybe<Array<Maybe<Scalars['String']>>>;
  authors_ne: Maybe<Array<Maybe<Scalars['String']>>>;
  OR: Maybe<Array<Maybe<BookSummaryFilters>>>;
  SORT: Maybe<BookSummarySort>;
  SORTS: Maybe<Array<Maybe<BookSummarySort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
};


export type QueryGetBookSummaryArgs = {
  _id: Maybe<Scalars['String']>;
};


export type QueryAllBooksDeletedsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<BooksDeletedFilters>>>;
  SORT: Maybe<BooksDeletedSort>;
  SORTS: Maybe<Array<Maybe<BooksDeletedSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
};


export type QueryGetBooksDeletedArgs = {
  _id: Maybe<Scalars['String']>;
};


export type QueryAllLabelColorsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  order_lt: Maybe<Scalars['Int']>;
  order_lte: Maybe<Scalars['Int']>;
  order_gt: Maybe<Scalars['Int']>;
  order_gte: Maybe<Scalars['Int']>;
  order: Maybe<Scalars['Int']>;
  order_ne: Maybe<Scalars['Int']>;
  order_in: Maybe<Array<Maybe<Scalars['Int']>>>;
  order_nin: Maybe<Array<Maybe<Scalars['Int']>>>;
  OR: Maybe<Array<Maybe<LabelColorFilters>>>;
  SORT: Maybe<LabelColorSort>;
  SORTS: Maybe<Array<Maybe<LabelColorSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryAllSubjectsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  name_contains: Maybe<Scalars['String']>;
  name_startsWith: Maybe<Scalars['String']>;
  name_endsWith: Maybe<Scalars['String']>;
  name_regex: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  name_ne: Maybe<Scalars['String']>;
  name_in: Maybe<Array<Maybe<Scalars['String']>>>;
  name_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  path_contains: Maybe<Scalars['String']>;
  path_startsWith: Maybe<Scalars['String']>;
  path_endsWith: Maybe<Scalars['String']>;
  path_regex: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  path_ne: Maybe<Scalars['String']>;
  path_in: Maybe<Array<Maybe<Scalars['String']>>>;
  path_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_contains: Maybe<Scalars['String']>;
  textColor_startsWith: Maybe<Scalars['String']>;
  textColor_endsWith: Maybe<Scalars['String']>;
  textColor_regex: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  textColor_ne: Maybe<Scalars['String']>;
  textColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<SubjectFilters>>>;
  SORT: Maybe<SubjectSort>;
  SORTS: Maybe<Array<Maybe<SubjectSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryGetSubjectArgs = {
  _id: Maybe<Scalars['String']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryAllSubjectsDeletedsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<SubjectsDeletedFilters>>>;
  SORT: Maybe<SubjectsDeletedSort>;
  SORTS: Maybe<Array<Maybe<SubjectsDeletedSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
};


export type QueryGetSubjectsDeletedArgs = {
  _id: Maybe<Scalars['String']>;
};


export type QueryAllTagsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  name_contains: Maybe<Scalars['String']>;
  name_startsWith: Maybe<Scalars['String']>;
  name_endsWith: Maybe<Scalars['String']>;
  name_regex: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  name_ne: Maybe<Scalars['String']>;
  name_in: Maybe<Array<Maybe<Scalars['String']>>>;
  name_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  path_contains: Maybe<Scalars['String']>;
  path_startsWith: Maybe<Scalars['String']>;
  path_endsWith: Maybe<Scalars['String']>;
  path_regex: Maybe<Scalars['String']>;
  path: Maybe<Scalars['String']>;
  path_ne: Maybe<Scalars['String']>;
  path_in: Maybe<Array<Maybe<Scalars['String']>>>;
  path_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_contains: Maybe<Scalars['String']>;
  backgroundColor_startsWith: Maybe<Scalars['String']>;
  backgroundColor_endsWith: Maybe<Scalars['String']>;
  backgroundColor_regex: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  backgroundColor_ne: Maybe<Scalars['String']>;
  backgroundColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  backgroundColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_contains: Maybe<Scalars['String']>;
  textColor_startsWith: Maybe<Scalars['String']>;
  textColor_endsWith: Maybe<Scalars['String']>;
  textColor_regex: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  textColor_ne: Maybe<Scalars['String']>;
  textColor_in: Maybe<Array<Maybe<Scalars['String']>>>;
  textColor_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  timestamp_lt: Maybe<Scalars['Float']>;
  timestamp_lte: Maybe<Scalars['Float']>;
  timestamp_gt: Maybe<Scalars['Float']>;
  timestamp_gte: Maybe<Scalars['Float']>;
  timestamp: Maybe<Scalars['Float']>;
  timestamp_ne: Maybe<Scalars['Float']>;
  timestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  timestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<TagFilters>>>;
  SORT: Maybe<TagSort>;
  SORTS: Maybe<Array<Maybe<TagSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryGetTagArgs = {
  _id: Maybe<Scalars['String']>;
  publicUserId: Maybe<Scalars['String']>;
  ver: Maybe<Scalars['String']>;
  cache: Maybe<Scalars['Int']>;
};


export type QueryAllTagsDeletedsArgs = {
  _id: Maybe<Scalars['String']>;
  _id_ne: Maybe<Scalars['String']>;
  _id_in: Maybe<Array<Maybe<Scalars['String']>>>;
  _id_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_contains: Maybe<Scalars['String']>;
  userId_startsWith: Maybe<Scalars['String']>;
  userId_endsWith: Maybe<Scalars['String']>;
  userId_regex: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  userId_ne: Maybe<Scalars['String']>;
  userId_in: Maybe<Array<Maybe<Scalars['String']>>>;
  userId_nin: Maybe<Array<Maybe<Scalars['String']>>>;
  deletedTimestamp_lt: Maybe<Scalars['Float']>;
  deletedTimestamp_lte: Maybe<Scalars['Float']>;
  deletedTimestamp_gt: Maybe<Scalars['Float']>;
  deletedTimestamp_gte: Maybe<Scalars['Float']>;
  deletedTimestamp: Maybe<Scalars['Float']>;
  deletedTimestamp_ne: Maybe<Scalars['Float']>;
  deletedTimestamp_in: Maybe<Array<Maybe<Scalars['Float']>>>;
  deletedTimestamp_nin: Maybe<Array<Maybe<Scalars['Float']>>>;
  OR: Maybe<Array<Maybe<TagsDeletedFilters>>>;
  SORT: Maybe<TagsDeletedSort>;
  SORTS: Maybe<Array<Maybe<TagsDeletedSort>>>;
  LIMIT: Maybe<Scalars['Int']>;
  SKIP: Maybe<Scalars['Int']>;
  PAGE: Maybe<Scalars['Int']>;
  PAGE_SIZE: Maybe<Scalars['Int']>;
};


export type QueryGetTagsDeletedArgs = {
  _id: Maybe<Scalars['String']>;
};


export type QueryGetPublicUserArgs = {
  userId: Maybe<Scalars['String']>;
};

export type Mutation = {
  createBook: Maybe<BookMutationResult>;
  updateBook: Maybe<BookMutationResult>;
  updateBooks: Maybe<BookMutationResultMulti>;
  updateBooksBulk: Maybe<BookBulkMutationResult>;
  deleteBook: Maybe<DeletionResultInfo>;
  updateBookSummary: Maybe<BookSummaryMutationResult>;
  createSubject: Maybe<SubjectMutationResult>;
  updateSubject: Maybe<SubjectMutationResultMulti>;
  deleteSubject: Maybe<Array<Maybe<Scalars['String']>>>;
  createTag: Maybe<TagMutationResult>;
  updateTag: Maybe<TagMutationResult>;
  updateTags: Maybe<TagMutationResultMulti>;
  updateTagsBulk: Maybe<TagBulkMutationResult>;
  deleteTag: Maybe<DeletionResultInfo>;
  updateUser: Maybe<UserSingleQueryResult>;
};


export type MutationCreateBookArgs = {
  Book: Maybe<BookInput>;
};


export type MutationUpdateBookArgs = {
  _id: Maybe<Scalars['String']>;
  Updates: Maybe<BookMutationInput>;
};


export type MutationUpdateBooksArgs = {
  _ids: Maybe<Array<Maybe<Scalars['String']>>>;
  Updates: Maybe<BookMutationInput>;
};


export type MutationUpdateBooksBulkArgs = {
  Match: Maybe<BookFilters>;
  Updates: Maybe<BookMutationInput>;
};


export type MutationDeleteBookArgs = {
  _id: Maybe<Scalars['String']>;
};


export type MutationUpdateBookSummaryArgs = {
  _id: Maybe<Scalars['String']>;
  Updates: Maybe<BookSummaryMutationInput>;
};


export type MutationCreateSubjectArgs = {
  Subject: Maybe<SubjectInput>;
};


export type MutationUpdateSubjectArgs = {
  _id: Maybe<Scalars['String']>;
  name: Maybe<Scalars['String']>;
  backgroundColor: Maybe<Scalars['String']>;
  textColor: Maybe<Scalars['String']>;
  parentId: Maybe<Scalars['String']>;
};


export type MutationDeleteSubjectArgs = {
  _id: Maybe<Scalars['String']>;
};


export type MutationCreateTagArgs = {
  Tag: Maybe<TagInput>;
};


export type MutationUpdateTagArgs = {
  _id: Maybe<Scalars['String']>;
  Updates: Maybe<TagMutationInput>;
};


export type MutationUpdateTagsArgs = {
  _ids: Maybe<Array<Maybe<Scalars['String']>>>;
  Updates: Maybe<TagMutationInput>;
};


export type MutationUpdateTagsBulkArgs = {
  Match: Maybe<TagFilters>;
  Updates: Maybe<TagMutationInput>;
};


export type MutationDeleteTagArgs = {
  _id: Maybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  Updates: Maybe<UserUpdates>;
};

export type User = {
  email: Maybe<Scalars['String']>;
  userId: Maybe<Scalars['String']>;
  isPublic: Maybe<Scalars['Boolean']>;
  publicName: Maybe<Scalars['String']>;
  publicBooksHeader: Maybe<Scalars['String']>;
};

export type PublicUser = {
  email: Maybe<Scalars['String']>;
  isPublic: Maybe<Scalars['Boolean']>;
  publicName: Maybe<Scalars['String']>;
  publicBooksHeader: Maybe<Scalars['String']>;
};

export type UserSingleQueryResult = {
  User: Maybe<User>;
};

export type PublicUserSingleQueryResult = {
  PublicUser: Maybe<User>;
};

export type UserUpdates = {
  isPublic: Maybe<Scalars['Boolean']>;
  publicBooksHeader: Maybe<Scalars['String']>;
  publicName: Maybe<Scalars['String']>;
};
