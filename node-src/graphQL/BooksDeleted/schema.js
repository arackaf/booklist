export const type = `
  
  type BooksDeleted {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  type BooksDeletedQueryResults {
    BooksDeleteds: [BooksDeleted]
    Meta: QueryResultsMetadata
  }

  type BooksDeletedSingleQueryResult {
    BooksDeleted: BooksDeleted
  }

  type BooksDeletedMutationResult {
    success: Boolean
    BooksDeleted: BooksDeleted
  }

  type BooksDeletedMutationResultMulti {
    success: Boolean
    BooksDeleteds: [BooksDeleted]
  }

  type BooksDeletedBulkMutationResult {
    success: Boolean
  }

  input BooksDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  input BooksDeletedMutationInput {
    userId: String
    deletedTimestamp: Int
    deletedTimestamp_INC: Int
    deletedTimestamp_DEC: Int
  }

  input BooksDeletedSort {
    _id: Int
    userId: Int
    deletedTimestamp: Int
  }

  input BooksDeletedFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    userId_contains: String
    userId_startsWith: String
    userId_endsWith: String
    userId_regex: String
    userId: String
    userId_ne: String
    userId_in: [String]
    deletedTimestamp_lt: Int
    deletedTimestamp_lte: Int
    deletedTimestamp_gt: Int
    deletedTimestamp_gte: Int
    deletedTimestamp: Int
    deletedTimestamp_ne: Int
    deletedTimestamp_in: [Int]
    OR: [BooksDeletedFilters]
  }
  
`;
  
  
export const mutation = `



`;


export const query = `

  allBooksDeleteds (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    userId_contains: String,
    userId_startsWith: String,
    userId_endsWith: String,
    userId_regex: String,
    userId: String,
    userId_ne: String,
    userId_in: [String],
    deletedTimestamp_lt: Int,
    deletedTimestamp_lte: Int,
    deletedTimestamp_gt: Int,
    deletedTimestamp_gte: Int,
    deletedTimestamp: Int,
    deletedTimestamp_ne: Int,
    deletedTimestamp_in: [Int],
    OR: [BooksDeletedFilters],
    SORT: BooksDeletedSort,
    SORTS: [BooksDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): BooksDeletedQueryResults

  getBooksDeleted (
    _id: String
  ): BooksDeletedSingleQueryResult

`;
  
