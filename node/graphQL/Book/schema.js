export const type = `
  
  type Book {
    _id: String!
    ean: String
    isbn: String
    title: String!
    mobileImage: String
    mobileImagePreview: JSON
    smallImage: String
    smallImagePreview: JSON
    mediumImage: String
    mediumImagePreview: JSON
    userId: String
    publisher: String
    publicationDate: String
    pages: Int
    authors: [String]
    subjects: [String]
    tags: [String]
    isRead: Boolean
    dateAdded: String
    editorialReviews: [EditorialReview]
    similarItems: [String]
    similarItemsLastUpdate: Int
    timestamp: Float
    similarBooks(FILTER: BookSummaryFilters, LIMIT: Int, SKIP: Int, PAGE: Int, PAGE_SIZE: Int, SORT: BookSummarySort, SORTS: [BookSummarySort], PREFER_LOOKUP: Boolean, DONT_PREFER_LOOKUP: Boolean): [BookSummary!]!
    similarBooksMeta(FILTER: BookSummaryFilters): QueryRelationshipResultsMetadata
  }

  type BookQueryResults {
    Books: [Book!]!
    Meta: QueryResultsMetadata!
  }

  type BookSingleQueryResult {
    Book: Book
  }

  type BookMutationResult {
    Book: Book
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BookMutationResultMulti {
    Books: [Book]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type BookBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input BookInput {
    _id: String
    ean: String
    isbn: String
    title: String!
    mobileImage: String
    mobileImagePreview: JSON
    smallImage: String
    smallImagePreview: JSON
    mediumImage: String
    mediumImagePreview: JSON
    userId: String
    publisher: String
    publicationDate: String
    pages: Int
    authors: [String]
    subjects: [String]
    tags: [String]
    isRead: Boolean
    dateAdded: String
    editorialReviews: [EditorialReviewInput]
    similarItems: [String]
    similarItemsLastUpdate: Int
    timestamp: Float
    similarBooks: [BookSummaryInput]
  }

  input BookMutationInput {
    ean: String
    isbn: String
    title: String
    mobileImage: String
    mobileImagePreview: JSON
    smallImage: String
    smallImagePreview: JSON
    mediumImage: String
    mediumImagePreview: JSON
    userId: String
    publisher: String
    publicationDate: String
    pages: Int
    pages_INC: Int
    pages_DEC: Int
    authors: [String]
    authors_PUSH: String
    authors_CONCAT: [String]
    authors_UPDATE: StringArrayUpdate
    authors_UPDATES: [StringArrayUpdate]
    authors_PULL: [String]
    authors_ADDTOSET: [String]
    subjects: [String]
    subjects_PUSH: String
    subjects_CONCAT: [String]
    subjects_UPDATE: StringArrayUpdate
    subjects_UPDATES: [StringArrayUpdate]
    subjects_PULL: [String]
    subjects_ADDTOSET: [String]
    tags: [String]
    tags_PUSH: String
    tags_CONCAT: [String]
    tags_UPDATE: StringArrayUpdate
    tags_UPDATES: [StringArrayUpdate]
    tags_PULL: [String]
    tags_ADDTOSET: [String]
    isRead: Boolean
    dateAdded: String
    editorialReviews: [EditorialReviewInput]
    editorialReviews_PUSH: EditorialReviewInput
    editorialReviews_CONCAT: [EditorialReviewInput]
    editorialReviews_UPDATE: EditorialReviewArrayMutationInput
    editorialReviews_UPDATES: [EditorialReviewArrayMutationInput]
    editorialReviews_PULL: EditorialReviewFilters
    similarItems: [String]
    similarItems_PUSH: String
    similarItems_CONCAT: [String]
    similarItems_UPDATE: StringArrayUpdate
    similarItems_UPDATES: [StringArrayUpdate]
    similarItems_PULL: [String]
    similarItems_ADDTOSET: [String]
    similarItemsLastUpdate: Int
    similarItemsLastUpdate_INC: Int
    similarItemsLastUpdate_DEC: Int
    timestamp: Float
    timestamp_INC: Int
    timestamp_DEC: Int
    similarBooks_ADD: [BookSummaryInput]
  }

  input BookSort {
    _id: Int
    ean: Int
    isbn: Int
    title: Int
    mobileImage: Int
    smallImage: Int
    mediumImage: Int
    userId: Int
    publisher: Int
    publicationDate: Int
    pages: Int
    authors: Int
    subjects: Int
    tags: Int
    isRead: Int
    dateAdded: Int
    editorialReviews: Int
    similarItems: Int
    similarItemsLastUpdate: Int
    timestamp: Int
  }

  input BookFilters {
    isbn: String
    isbn_in: [String]
    title_contains: String
    userId: String
    userId_in: [String]
    publisher_contains: String
    publisher: String
    publisher_in: [String]
    pages_lt: Int
    pages_gt: Int
    pages: Int
    authors_textContains: String
    authors_in: [[String]]
    subjects_count: Int
    subjects_containsAny: [String]
    tags_containsAny: [String]
    isRead: Boolean
    isRead_ne: Boolean
    timestamp_lt: Float
    timestamp_lte: Float
    timestamp_gt: Float
    timestamp_gte: Float
    OR: [BookFilters]
  }
  
`;

export const mutation = `

  createBook (
    Book: BookInput
  ): BookMutationResult

  updateBook (
    _id: String,
    Updates: BookMutationInput
  ): BookMutationResult

  updateBooks (
    _ids: [String],
    Updates: BookMutationInput
  ): BookMutationResultMulti

  updateBooksBulk (
    Match: BookFilters,
    Updates: BookMutationInput
  ): BookBulkMutationResult

  deleteBook (
    _id: String
  ): DeletionResultInfo

`;

export const query = `

  allBooks (
    isbn: String,
    isbn_in: [String],
    title_contains: String,
    userId: String,
    userId_in: [String],
    publisher_contains: String,
    publisher: String,
    publisher_in: [String],
    pages_lt: Int,
    pages_gt: Int,
    pages: Int,
    authors_textContains: String,
    authors_in: [[String]],
    subjects_count: Int,
    subjects_containsAny: [String],
    tags_containsAny: [String],
    isRead: Boolean,
    isRead_ne: Boolean,
    timestamp_lt: Float,
    timestamp_lte: Float,
    timestamp_gt: Float,
    timestamp_gte: Float,
    OR: [BookFilters],
    SORT: BookSort,
    SORTS: [BookSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    searchChildSubjects: Boolean,
    publicUserId: String,
    ver: String,
    cache: Int
  ): BookQueryResults!

  getBook (
    _id: String,
    searchChildSubjects: Boolean,
    publicUserId: String,
    ver: String,
    cache: Int
  ): BookSingleQueryResult!

`;
