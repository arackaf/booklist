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
export type InputMaybe<T> = Maybe<T>;
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
  mobileImage: Maybe<Scalars['String']>;
  mobileImagePreview: Maybe<Scalars['JSON']>;
  smallImage: Maybe<Scalars['String']>;
  smallImagePreview: Maybe<Scalars['JSON']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImagePreview: Maybe<Scalars['JSON']>;
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
  FILTER: InputMaybe<BookSummaryFilters>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
  SORT: InputMaybe<BookSummarySort>;
  SORTS: InputMaybe<Array<InputMaybe<BookSummarySort>>>;
  PREFER_LOOKUP: InputMaybe<Scalars['Boolean']>;
  DONT_PREFER_LOOKUP: InputMaybe<Scalars['Boolean']>;
};


export type BookSimilarBooksMetaArgs = {
  FILTER: InputMaybe<BookSummaryFilters>;
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
  _id: InputMaybe<Scalars['String']>;
  ean: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  mobileImage: InputMaybe<Scalars['String']>;
  mobileImagePreview: InputMaybe<Scalars['JSON']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImagePreview: InputMaybe<Scalars['JSON']>;
  mediumImage: InputMaybe<Scalars['String']>;
  mediumImagePreview: InputMaybe<Scalars['JSON']>;
  userId: InputMaybe<Scalars['String']>;
  publisher: InputMaybe<Scalars['String']>;
  publicationDate: InputMaybe<Scalars['String']>;
  pages: InputMaybe<Scalars['Int']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isRead: InputMaybe<Scalars['Boolean']>;
  dateAdded: InputMaybe<Scalars['String']>;
  editorialReviews: InputMaybe<Array<InputMaybe<EditorialReviewInput>>>;
  similarItems: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  similarItemsLastUpdate: InputMaybe<Scalars['Int']>;
  timestamp: InputMaybe<Scalars['Float']>;
  similarBooks: InputMaybe<Array<InputMaybe<BookSummaryInput>>>;
};

export type BookMutationInput = {
  ean: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  mobileImage: InputMaybe<Scalars['String']>;
  mobileImagePreview: InputMaybe<Scalars['JSON']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImagePreview: InputMaybe<Scalars['JSON']>;
  mediumImage: InputMaybe<Scalars['String']>;
  mediumImagePreview: InputMaybe<Scalars['JSON']>;
  userId: InputMaybe<Scalars['String']>;
  publisher: InputMaybe<Scalars['String']>;
  publicationDate: InputMaybe<Scalars['String']>;
  pages: InputMaybe<Scalars['Int']>;
  pages_INC: InputMaybe<Scalars['Int']>;
  pages_DEC: InputMaybe<Scalars['Int']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_PUSH: InputMaybe<Scalars['String']>;
  authors_CONCAT: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_UPDATE: InputMaybe<StringArrayUpdate>;
  authors_UPDATES: InputMaybe<Array<InputMaybe<StringArrayUpdate>>>;
  authors_PULL: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ADDTOSET: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_PUSH: InputMaybe<Scalars['String']>;
  subjects_CONCAT: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_UPDATE: InputMaybe<StringArrayUpdate>;
  subjects_UPDATES: InputMaybe<Array<InputMaybe<StringArrayUpdate>>>;
  subjects_PULL: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_ADDTOSET: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_PUSH: InputMaybe<Scalars['String']>;
  tags_CONCAT: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_UPDATE: InputMaybe<StringArrayUpdate>;
  tags_UPDATES: InputMaybe<Array<InputMaybe<StringArrayUpdate>>>;
  tags_PULL: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_ADDTOSET: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isRead: InputMaybe<Scalars['Boolean']>;
  dateAdded: InputMaybe<Scalars['String']>;
  editorialReviews: InputMaybe<Array<InputMaybe<EditorialReviewInput>>>;
  editorialReviews_PUSH: InputMaybe<EditorialReviewInput>;
  editorialReviews_CONCAT: InputMaybe<Array<InputMaybe<EditorialReviewInput>>>;
  editorialReviews_UPDATE: InputMaybe<EditorialReviewArrayMutationInput>;
  editorialReviews_UPDATES: InputMaybe<Array<InputMaybe<EditorialReviewArrayMutationInput>>>;
  editorialReviews_PULL: InputMaybe<EditorialReviewFilters>;
  similarItems: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  similarItems_PUSH: InputMaybe<Scalars['String']>;
  similarItems_CONCAT: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  similarItems_UPDATE: InputMaybe<StringArrayUpdate>;
  similarItems_UPDATES: InputMaybe<Array<InputMaybe<StringArrayUpdate>>>;
  similarItems_PULL: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  similarItems_ADDTOSET: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  similarItemsLastUpdate: InputMaybe<Scalars['Int']>;
  similarItemsLastUpdate_INC: InputMaybe<Scalars['Int']>;
  similarItemsLastUpdate_DEC: InputMaybe<Scalars['Int']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_INC: InputMaybe<Scalars['Int']>;
  timestamp_DEC: InputMaybe<Scalars['Int']>;
  similarBooks_ADD: InputMaybe<Array<InputMaybe<BookSummaryInput>>>;
};

export type BookSort = {
  _id: InputMaybe<Scalars['Int']>;
  ean: InputMaybe<Scalars['Int']>;
  isbn: InputMaybe<Scalars['Int']>;
  title: InputMaybe<Scalars['Int']>;
  mobileImage: InputMaybe<Scalars['Int']>;
  smallImage: InputMaybe<Scalars['Int']>;
  mediumImage: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  publisher: InputMaybe<Scalars['Int']>;
  publicationDate: InputMaybe<Scalars['Int']>;
  pages: InputMaybe<Scalars['Int']>;
  authors: InputMaybe<Scalars['Int']>;
  subjects: InputMaybe<Scalars['Int']>;
  tags: InputMaybe<Scalars['Int']>;
  isRead: InputMaybe<Scalars['Int']>;
  dateAdded: InputMaybe<Scalars['Int']>;
  editorialReviews: InputMaybe<Scalars['Int']>;
  similarItems: InputMaybe<Scalars['Int']>;
  similarItemsLastUpdate: InputMaybe<Scalars['Int']>;
  timestamp: InputMaybe<Scalars['Int']>;
};

export type BookFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_contains: InputMaybe<Scalars['String']>;
  isbn_startsWith: InputMaybe<Scalars['String']>;
  isbn_endsWith: InputMaybe<Scalars['String']>;
  isbn_regex: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  isbn_ne: InputMaybe<Scalars['String']>;
  isbn_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_contains: InputMaybe<Scalars['String']>;
  title_startsWith: InputMaybe<Scalars['String']>;
  title_endsWith: InputMaybe<Scalars['String']>;
  title_regex: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  title_ne: InputMaybe<Scalars['String']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publisher_contains: InputMaybe<Scalars['String']>;
  publisher_startsWith: InputMaybe<Scalars['String']>;
  publisher_endsWith: InputMaybe<Scalars['String']>;
  publisher_regex: InputMaybe<Scalars['String']>;
  publisher: InputMaybe<Scalars['String']>;
  publisher_ne: InputMaybe<Scalars['String']>;
  publisher_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publisher_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pages_lt: InputMaybe<Scalars['Int']>;
  pages_lte: InputMaybe<Scalars['Int']>;
  pages_gt: InputMaybe<Scalars['Int']>;
  pages_gte: InputMaybe<Scalars['Int']>;
  pages: InputMaybe<Scalars['Int']>;
  pages_ne: InputMaybe<Scalars['Int']>;
  pages_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  pages_nin: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  authors_count: InputMaybe<Scalars['Int']>;
  authors_textContains: InputMaybe<Scalars['String']>;
  authors_startsWith: InputMaybe<Scalars['String']>;
  authors_endsWith: InputMaybe<Scalars['String']>;
  authors_regex: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_contains: InputMaybe<Scalars['String']>;
  authors_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_count: InputMaybe<Scalars['Int']>;
  subjects_textContains: InputMaybe<Scalars['String']>;
  subjects_startsWith: InputMaybe<Scalars['String']>;
  subjects_endsWith: InputMaybe<Scalars['String']>;
  subjects_regex: InputMaybe<Scalars['String']>;
  subjects: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  subjects_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  subjects_contains: InputMaybe<Scalars['String']>;
  subjects_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_count: InputMaybe<Scalars['Int']>;
  tags_textContains: InputMaybe<Scalars['String']>;
  tags_startsWith: InputMaybe<Scalars['String']>;
  tags_endsWith: InputMaybe<Scalars['String']>;
  tags_regex: InputMaybe<Scalars['String']>;
  tags: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  tags_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  tags_contains: InputMaybe<Scalars['String']>;
  tags_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isRead: InputMaybe<Scalars['Boolean']>;
  isRead_ne: InputMaybe<Scalars['Boolean']>;
  isRead_in: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  isRead_nin: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  dateAdded_contains: InputMaybe<Scalars['String']>;
  dateAdded_startsWith: InputMaybe<Scalars['String']>;
  dateAdded_endsWith: InputMaybe<Scalars['String']>;
  dateAdded_regex: InputMaybe<Scalars['String']>;
  dateAdded: InputMaybe<Scalars['String']>;
  dateAdded_ne: InputMaybe<Scalars['String']>;
  dateAdded_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateAdded_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<BookFilters>>>;
};

export type BookSummary = {
  _id: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  asin: Maybe<Scalars['String']>;
  isbn: Maybe<Scalars['String']>;
  ean: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
  smallImagePreview: Maybe<Scalars['String']>;
  mediumImage: Maybe<Scalars['String']>;
  mediumImagePreview: Maybe<Scalars['String']>;
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
  _id: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  asin: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  ean: InputMaybe<Scalars['String']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImagePreview: InputMaybe<Scalars['String']>;
  mediumImage: InputMaybe<Scalars['String']>;
  mediumImagePreview: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BookSummaryMutationInput = {
  title: InputMaybe<Scalars['String']>;
  asin: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  ean: InputMaybe<Scalars['String']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImagePreview: InputMaybe<Scalars['String']>;
  mediumImage: InputMaybe<Scalars['String']>;
  mediumImagePreview: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_PUSH: InputMaybe<Scalars['String']>;
  authors_CONCAT: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_UPDATE: InputMaybe<StringArrayUpdate>;
  authors_UPDATES: InputMaybe<Array<InputMaybe<StringArrayUpdate>>>;
  authors_PULL: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ADDTOSET: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BookSummarySort = {
  _id: InputMaybe<Scalars['Int']>;
  title: InputMaybe<Scalars['Int']>;
  asin: InputMaybe<Scalars['Int']>;
  isbn: InputMaybe<Scalars['Int']>;
  ean: InputMaybe<Scalars['Int']>;
  smallImage: InputMaybe<Scalars['Int']>;
  smallImagePreview: InputMaybe<Scalars['Int']>;
  mediumImage: InputMaybe<Scalars['Int']>;
  mediumImagePreview: InputMaybe<Scalars['Int']>;
  authors: InputMaybe<Scalars['Int']>;
};

export type BookSummaryFilters = {
  title_contains: InputMaybe<Scalars['String']>;
  title_startsWith: InputMaybe<Scalars['String']>;
  title_endsWith: InputMaybe<Scalars['String']>;
  title_regex: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  title_ne: InputMaybe<Scalars['String']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  asin_contains: InputMaybe<Scalars['String']>;
  asin_startsWith: InputMaybe<Scalars['String']>;
  asin_endsWith: InputMaybe<Scalars['String']>;
  asin_regex: InputMaybe<Scalars['String']>;
  asin: InputMaybe<Scalars['String']>;
  asin_ne: InputMaybe<Scalars['String']>;
  asin_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  asin_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_contains: InputMaybe<Scalars['String']>;
  isbn_startsWith: InputMaybe<Scalars['String']>;
  isbn_endsWith: InputMaybe<Scalars['String']>;
  isbn_regex: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  isbn_ne: InputMaybe<Scalars['String']>;
  isbn_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  smallImage_contains: InputMaybe<Scalars['String']>;
  smallImage_startsWith: InputMaybe<Scalars['String']>;
  smallImage_endsWith: InputMaybe<Scalars['String']>;
  smallImage_regex: InputMaybe<Scalars['String']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImage_ne: InputMaybe<Scalars['String']>;
  smallImage_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  smallImage_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_count: InputMaybe<Scalars['Int']>;
  authors_textContains: InputMaybe<Scalars['String']>;
  authors_startsWith: InputMaybe<Scalars['String']>;
  authors_endsWith: InputMaybe<Scalars['String']>;
  authors_regex: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_contains: InputMaybe<Scalars['String']>;
  authors_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  OR: InputMaybe<Array<InputMaybe<BookSummaryFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
};

export type BooksDeletedMutationInput = {
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_INC: InputMaybe<Scalars['Int']>;
  deletedTimestamp_DEC: InputMaybe<Scalars['Int']>;
};

export type BooksDeletedSort = {
  _id: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  deletedTimestamp: InputMaybe<Scalars['Int']>;
};

export type BooksDeletedFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<BooksDeletedFilters>>>;
};

export type EditorialReview = {
  source: Maybe<Scalars['String']>;
  content: Maybe<Scalars['String']>;
};

export type EditorialReviewInput = {
  source: InputMaybe<Scalars['String']>;
  content: InputMaybe<Scalars['String']>;
};

export type EditorialReviewMutationInput = {
  source: InputMaybe<Scalars['String']>;
  content: InputMaybe<Scalars['String']>;
};

export type EditorialReviewArrayMutationInput = {
  index: InputMaybe<Scalars['Int']>;
  Updates: InputMaybe<EditorialReviewMutationInput>;
};

export type EditorialReviewSort = {
  source: InputMaybe<Scalars['Int']>;
  content: InputMaybe<Scalars['Int']>;
};

export type EditorialReviewFilters = {
  source_contains: InputMaybe<Scalars['String']>;
  source_startsWith: InputMaybe<Scalars['String']>;
  source_endsWith: InputMaybe<Scalars['String']>;
  source_regex: InputMaybe<Scalars['String']>;
  source: InputMaybe<Scalars['String']>;
  source_ne: InputMaybe<Scalars['String']>;
  source_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  source_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  content_contains: InputMaybe<Scalars['String']>;
  content_startsWith: InputMaybe<Scalars['String']>;
  content_endsWith: InputMaybe<Scalars['String']>;
  content_regex: InputMaybe<Scalars['String']>;
  content: InputMaybe<Scalars['String']>;
  content_ne: InputMaybe<Scalars['String']>;
  content_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  content_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  OR: InputMaybe<Array<InputMaybe<EditorialReviewFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  order: InputMaybe<Scalars['Int']>;
};

export type LabelColorMutationInput = {
  backgroundColor: InputMaybe<Scalars['String']>;
  order: InputMaybe<Scalars['Int']>;
  order_INC: InputMaybe<Scalars['Int']>;
  order_DEC: InputMaybe<Scalars['Int']>;
};

export type LabelColorSort = {
  _id: InputMaybe<Scalars['Int']>;
  backgroundColor: InputMaybe<Scalars['Int']>;
  order: InputMaybe<Scalars['Int']>;
};

export type LabelColorFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  OR: InputMaybe<Array<InputMaybe<LabelColorFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  textColor: InputMaybe<Scalars['String']>;
  timestamp: InputMaybe<Scalars['Float']>;
};

export type SubjectMutationInput = {
  name: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  textColor: InputMaybe<Scalars['String']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_INC: InputMaybe<Scalars['Int']>;
  timestamp_DEC: InputMaybe<Scalars['Int']>;
};

export type SubjectSort = {
  _id: InputMaybe<Scalars['Int']>;
  name: InputMaybe<Scalars['Int']>;
  path: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  backgroundColor: InputMaybe<Scalars['Int']>;
  textColor: InputMaybe<Scalars['Int']>;
  timestamp: InputMaybe<Scalars['Int']>;
};

export type SubjectFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_contains: InputMaybe<Scalars['String']>;
  name_startsWith: InputMaybe<Scalars['String']>;
  name_endsWith: InputMaybe<Scalars['String']>;
  name_regex: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  name_ne: InputMaybe<Scalars['String']>;
  name_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_contains: InputMaybe<Scalars['String']>;
  path_startsWith: InputMaybe<Scalars['String']>;
  path_endsWith: InputMaybe<Scalars['String']>;
  path_regex: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  path_ne: InputMaybe<Scalars['String']>;
  path_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<SubjectFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
};

export type SubjectsDeletedMutationInput = {
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_INC: InputMaybe<Scalars['Int']>;
  deletedTimestamp_DEC: InputMaybe<Scalars['Int']>;
};

export type SubjectsDeletedSort = {
  _id: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  deletedTimestamp: InputMaybe<Scalars['Int']>;
};

export type SubjectsDeletedFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<SubjectsDeletedFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  textColor: InputMaybe<Scalars['String']>;
  timestamp: InputMaybe<Scalars['Float']>;
};

export type TagMutationInput = {
  name: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  textColor: InputMaybe<Scalars['String']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_INC: InputMaybe<Scalars['Int']>;
  timestamp_DEC: InputMaybe<Scalars['Int']>;
};

export type TagSort = {
  _id: InputMaybe<Scalars['Int']>;
  name: InputMaybe<Scalars['Int']>;
  path: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  backgroundColor: InputMaybe<Scalars['Int']>;
  textColor: InputMaybe<Scalars['Int']>;
  timestamp: InputMaybe<Scalars['Int']>;
};

export type TagFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_contains: InputMaybe<Scalars['String']>;
  name_startsWith: InputMaybe<Scalars['String']>;
  name_endsWith: InputMaybe<Scalars['String']>;
  name_regex: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  name_ne: InputMaybe<Scalars['String']>;
  name_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_contains: InputMaybe<Scalars['String']>;
  path_startsWith: InputMaybe<Scalars['String']>;
  path_endsWith: InputMaybe<Scalars['String']>;
  path_regex: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  path_ne: InputMaybe<Scalars['String']>;
  path_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<TagFilters>>>;
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
  _id: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
};

export type TagsDeletedMutationInput = {
  userId: InputMaybe<Scalars['String']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_INC: InputMaybe<Scalars['Int']>;
  deletedTimestamp_DEC: InputMaybe<Scalars['Int']>;
};

export type TagsDeletedSort = {
  _id: InputMaybe<Scalars['Int']>;
  userId: InputMaybe<Scalars['Int']>;
  deletedTimestamp: InputMaybe<Scalars['Int']>;
};

export type TagsDeletedFilters = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<TagsDeletedFilters>>>;
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
  recentScanResults: Maybe<ScanResults>;
};


export type QueryAllBooksArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_contains: InputMaybe<Scalars['String']>;
  isbn_startsWith: InputMaybe<Scalars['String']>;
  isbn_endsWith: InputMaybe<Scalars['String']>;
  isbn_regex: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  isbn_ne: InputMaybe<Scalars['String']>;
  isbn_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_contains: InputMaybe<Scalars['String']>;
  title_startsWith: InputMaybe<Scalars['String']>;
  title_endsWith: InputMaybe<Scalars['String']>;
  title_regex: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  title_ne: InputMaybe<Scalars['String']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publisher_contains: InputMaybe<Scalars['String']>;
  publisher_startsWith: InputMaybe<Scalars['String']>;
  publisher_endsWith: InputMaybe<Scalars['String']>;
  publisher_regex: InputMaybe<Scalars['String']>;
  publisher: InputMaybe<Scalars['String']>;
  publisher_ne: InputMaybe<Scalars['String']>;
  publisher_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  publisher_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  pages_lt: InputMaybe<Scalars['Int']>;
  pages_lte: InputMaybe<Scalars['Int']>;
  pages_gt: InputMaybe<Scalars['Int']>;
  pages_gte: InputMaybe<Scalars['Int']>;
  pages: InputMaybe<Scalars['Int']>;
  pages_ne: InputMaybe<Scalars['Int']>;
  pages_in: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  pages_nin: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  authors_count: InputMaybe<Scalars['Int']>;
  authors_textContains: InputMaybe<Scalars['String']>;
  authors_startsWith: InputMaybe<Scalars['String']>;
  authors_endsWith: InputMaybe<Scalars['String']>;
  authors_regex: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_contains: InputMaybe<Scalars['String']>;
  authors_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_count: InputMaybe<Scalars['Int']>;
  subjects_textContains: InputMaybe<Scalars['String']>;
  subjects_startsWith: InputMaybe<Scalars['String']>;
  subjects_endsWith: InputMaybe<Scalars['String']>;
  subjects_regex: InputMaybe<Scalars['String']>;
  subjects: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  subjects_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  subjects_contains: InputMaybe<Scalars['String']>;
  subjects_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  subjects_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_count: InputMaybe<Scalars['Int']>;
  tags_textContains: InputMaybe<Scalars['String']>;
  tags_startsWith: InputMaybe<Scalars['String']>;
  tags_endsWith: InputMaybe<Scalars['String']>;
  tags_regex: InputMaybe<Scalars['String']>;
  tags: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  tags_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  tags_contains: InputMaybe<Scalars['String']>;
  tags_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isRead: InputMaybe<Scalars['Boolean']>;
  isRead_ne: InputMaybe<Scalars['Boolean']>;
  isRead_in: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  isRead_nin: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  dateAdded_contains: InputMaybe<Scalars['String']>;
  dateAdded_startsWith: InputMaybe<Scalars['String']>;
  dateAdded_endsWith: InputMaybe<Scalars['String']>;
  dateAdded_regex: InputMaybe<Scalars['String']>;
  dateAdded: InputMaybe<Scalars['String']>;
  dateAdded_ne: InputMaybe<Scalars['String']>;
  dateAdded_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  dateAdded_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<BookFilters>>>;
  SORT: InputMaybe<BookSort>;
  SORTS: InputMaybe<Array<InputMaybe<BookSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
  searchChildSubjects: InputMaybe<Scalars['Boolean']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryGetBookArgs = {
  _id: InputMaybe<Scalars['String']>;
  searchChildSubjects: InputMaybe<Scalars['Boolean']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryAllBookSummarysArgs = {
  title_contains: InputMaybe<Scalars['String']>;
  title_startsWith: InputMaybe<Scalars['String']>;
  title_endsWith: InputMaybe<Scalars['String']>;
  title_regex: InputMaybe<Scalars['String']>;
  title: InputMaybe<Scalars['String']>;
  title_ne: InputMaybe<Scalars['String']>;
  title_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  asin_contains: InputMaybe<Scalars['String']>;
  asin_startsWith: InputMaybe<Scalars['String']>;
  asin_endsWith: InputMaybe<Scalars['String']>;
  asin_regex: InputMaybe<Scalars['String']>;
  asin: InputMaybe<Scalars['String']>;
  asin_ne: InputMaybe<Scalars['String']>;
  asin_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  asin_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_contains: InputMaybe<Scalars['String']>;
  isbn_startsWith: InputMaybe<Scalars['String']>;
  isbn_endsWith: InputMaybe<Scalars['String']>;
  isbn_regex: InputMaybe<Scalars['String']>;
  isbn: InputMaybe<Scalars['String']>;
  isbn_ne: InputMaybe<Scalars['String']>;
  isbn_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isbn_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  smallImage_contains: InputMaybe<Scalars['String']>;
  smallImage_startsWith: InputMaybe<Scalars['String']>;
  smallImage_endsWith: InputMaybe<Scalars['String']>;
  smallImage_regex: InputMaybe<Scalars['String']>;
  smallImage: InputMaybe<Scalars['String']>;
  smallImage_ne: InputMaybe<Scalars['String']>;
  smallImage_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  smallImage_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_count: InputMaybe<Scalars['Int']>;
  authors_textContains: InputMaybe<Scalars['String']>;
  authors_startsWith: InputMaybe<Scalars['String']>;
  authors_endsWith: InputMaybe<Scalars['String']>;
  authors_regex: InputMaybe<Scalars['String']>;
  authors: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_in: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_nin: InputMaybe<Array<InputMaybe<Array<InputMaybe<Scalars['String']>>>>>;
  authors_contains: InputMaybe<Scalars['String']>;
  authors_containsAny: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_containsAll: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  authors_ne: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  OR: InputMaybe<Array<InputMaybe<BookSummaryFilters>>>;
  SORT: InputMaybe<BookSummarySort>;
  SORTS: InputMaybe<Array<InputMaybe<BookSummarySort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
};


export type QueryGetBookSummaryArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type QueryAllBooksDeletedsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<BooksDeletedFilters>>>;
  SORT: InputMaybe<BooksDeletedSort>;
  SORTS: InputMaybe<Array<InputMaybe<BooksDeletedSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
};


export type QueryGetBooksDeletedArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type QueryAllLabelColorsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  OR: InputMaybe<Array<InputMaybe<LabelColorFilters>>>;
  SORT: InputMaybe<LabelColorSort>;
  SORTS: InputMaybe<Array<InputMaybe<LabelColorSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryAllSubjectsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_contains: InputMaybe<Scalars['String']>;
  name_startsWith: InputMaybe<Scalars['String']>;
  name_endsWith: InputMaybe<Scalars['String']>;
  name_regex: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  name_ne: InputMaybe<Scalars['String']>;
  name_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_contains: InputMaybe<Scalars['String']>;
  path_startsWith: InputMaybe<Scalars['String']>;
  path_endsWith: InputMaybe<Scalars['String']>;
  path_regex: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  path_ne: InputMaybe<Scalars['String']>;
  path_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<SubjectFilters>>>;
  SORT: InputMaybe<SubjectSort>;
  SORTS: InputMaybe<Array<InputMaybe<SubjectSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryGetSubjectArgs = {
  _id: InputMaybe<Scalars['String']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryAllSubjectsDeletedsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<SubjectsDeletedFilters>>>;
  SORT: InputMaybe<SubjectsDeletedSort>;
  SORTS: InputMaybe<Array<InputMaybe<SubjectsDeletedSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
};


export type QueryGetSubjectsDeletedArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type QueryAllTagsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_contains: InputMaybe<Scalars['String']>;
  name_startsWith: InputMaybe<Scalars['String']>;
  name_endsWith: InputMaybe<Scalars['String']>;
  name_regex: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  name_ne: InputMaybe<Scalars['String']>;
  name_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_contains: InputMaybe<Scalars['String']>;
  path_startsWith: InputMaybe<Scalars['String']>;
  path_endsWith: InputMaybe<Scalars['String']>;
  path_regex: InputMaybe<Scalars['String']>;
  path: InputMaybe<Scalars['String']>;
  path_ne: InputMaybe<Scalars['String']>;
  path_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  path_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  timestamp_lt: InputMaybe<Scalars['Float']>;
  timestamp_lte: InputMaybe<Scalars['Float']>;
  timestamp_gt: InputMaybe<Scalars['Float']>;
  timestamp_gte: InputMaybe<Scalars['Float']>;
  timestamp: InputMaybe<Scalars['Float']>;
  timestamp_ne: InputMaybe<Scalars['Float']>;
  timestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  timestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<TagFilters>>>;
  SORT: InputMaybe<TagSort>;
  SORTS: InputMaybe<Array<InputMaybe<TagSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryGetTagArgs = {
  _id: InputMaybe<Scalars['String']>;
  publicUserId: InputMaybe<Scalars['String']>;
  ver: InputMaybe<Scalars['String']>;
  cache: InputMaybe<Scalars['Int']>;
};


export type QueryAllTagsDeletedsArgs = {
  _id: InputMaybe<Scalars['String']>;
  _id_ne: InputMaybe<Scalars['String']>;
  _id_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  _id_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_contains: InputMaybe<Scalars['String']>;
  userId_startsWith: InputMaybe<Scalars['String']>;
  userId_endsWith: InputMaybe<Scalars['String']>;
  userId_regex: InputMaybe<Scalars['String']>;
  userId: InputMaybe<Scalars['String']>;
  userId_ne: InputMaybe<Scalars['String']>;
  userId_in: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId_nin: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  deletedTimestamp_lt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_lte: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gt: InputMaybe<Scalars['Float']>;
  deletedTimestamp_gte: InputMaybe<Scalars['Float']>;
  deletedTimestamp: InputMaybe<Scalars['Float']>;
  deletedTimestamp_ne: InputMaybe<Scalars['Float']>;
  deletedTimestamp_in: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  deletedTimestamp_nin: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  OR: InputMaybe<Array<InputMaybe<TagsDeletedFilters>>>;
  SORT: InputMaybe<TagsDeletedSort>;
  SORTS: InputMaybe<Array<InputMaybe<TagsDeletedSort>>>;
  LIMIT: InputMaybe<Scalars['Int']>;
  SKIP: InputMaybe<Scalars['Int']>;
  PAGE: InputMaybe<Scalars['Int']>;
  PAGE_SIZE: InputMaybe<Scalars['Int']>;
};


export type QueryGetTagsDeletedArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type QueryGetPublicUserArgs = {
  userId: InputMaybe<Scalars['String']>;
};


export type QueryRecentScanResultsArgs = {
  exclusiveStartKey: InputMaybe<DynamoKeyInput>;
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
  Book: InputMaybe<BookInput>;
};


export type MutationUpdateBookArgs = {
  _id: InputMaybe<Scalars['String']>;
  Updates: InputMaybe<BookMutationInput>;
};


export type MutationUpdateBooksArgs = {
  _ids: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  Updates: InputMaybe<BookMutationInput>;
};


export type MutationUpdateBooksBulkArgs = {
  Match: InputMaybe<BookFilters>;
  Updates: InputMaybe<BookMutationInput>;
};


export type MutationDeleteBookArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type MutationUpdateBookSummaryArgs = {
  _id: InputMaybe<Scalars['String']>;
  Updates: InputMaybe<BookSummaryMutationInput>;
};


export type MutationCreateSubjectArgs = {
  Subject: InputMaybe<SubjectInput>;
};


export type MutationUpdateSubjectArgs = {
  _id: InputMaybe<Scalars['String']>;
  name: InputMaybe<Scalars['String']>;
  backgroundColor: InputMaybe<Scalars['String']>;
  textColor: InputMaybe<Scalars['String']>;
  parentId: InputMaybe<Scalars['String']>;
};


export type MutationDeleteSubjectArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type MutationCreateTagArgs = {
  Tag: InputMaybe<TagInput>;
};


export type MutationUpdateTagArgs = {
  _id: InputMaybe<Scalars['String']>;
  Updates: InputMaybe<TagMutationInput>;
};


export type MutationUpdateTagsArgs = {
  _ids: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  Updates: InputMaybe<TagMutationInput>;
};


export type MutationUpdateTagsBulkArgs = {
  Match: InputMaybe<TagFilters>;
  Updates: InputMaybe<TagMutationInput>;
};


export type MutationDeleteTagArgs = {
  _id: InputMaybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  Updates: InputMaybe<UserUpdates>;
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
  isPublic: InputMaybe<Scalars['Boolean']>;
  publicBooksHeader: InputMaybe<Scalars['String']>;
  publicName: InputMaybe<Scalars['String']>;
};

export type ScanResult = {
  success: Maybe<Scalars['Boolean']>;
  isbn: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  smallImage: Maybe<Scalars['String']>;
};

export type DynamoKey = {
  pk: Maybe<Scalars['String']>;
  sk: Maybe<Scalars['String']>;
};

export type DynamoKeyInput = {
  pk: InputMaybe<Scalars['String']>;
  sk: InputMaybe<Scalars['String']>;
};

export type ScanResults = {
  ScanResults: Maybe<Array<Maybe<ScanResult>>>;
  LastEvaluatedKey: Maybe<DynamoKey>;
};
