export const type = `
  
  type BookSummary {
    _id: String
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    mediumImage: String
    authors: [String]
  }

  type BookSummaryQueryResults {
    BookSummarys: [BookSummary]
    Meta: QueryResultsMetadata
  }

  type BookSummarySingleQueryResult {
    BookSummary: BookSummary
  }

  type BookSummaryMutationResult {
    BookSummary: BookSummary
    success: Boolean
    Meta: MutationResultInfo
  }

  type BookSummaryMutationResultMulti {
    BookSummarys: [BookSummary]
    success: Boolean
    Meta: MutationResultInfo
  }

  type BookSummaryBulkMutationResult {
    success: Boolean
    Meta: MutationResultInfo
  }

  input BookSummaryInput {
    _id: String
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    mediumImage: String
    authors: [String]
  }

  input BookSummaryMutationInput {
    title: String
    asin: String
    isbn: String
    ean: String
    smallImage: String
    mediumImage: String
    authors: [String]
    authors_PUSH: String
    authors_CONCAT: [String]
    authors_UPDATE: StringArrayUpdate
    authors_UPDATES: [StringArrayUpdate]
    authors_PULL: [String]
    authors_ADDTOSET: [String]
  }

  input BookSummarySort {
    _id: Int
    title: Int
    asin: Int
    isbn: Int
    ean: Int
    smallImage: Int
    mediumImage: Int
    authors: Int
  }

  input BookSummaryFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    title_contains: String
    title_startsWith: String
    title_endsWith: String
    title_regex: String
    title: String
    title_ne: String
    title_in: [String]
    asin_contains: String
    asin_startsWith: String
    asin_endsWith: String
    asin_regex: String
    asin: String
    asin_ne: String
    asin_in: [String]
    isbn_contains: String
    isbn_startsWith: String
    isbn_endsWith: String
    isbn_regex: String
    isbn: String
    isbn_ne: String
    isbn_in: [String]
    ean_contains: String
    ean_startsWith: String
    ean_endsWith: String
    ean_regex: String
    ean: String
    ean_ne: String
    ean_in: [String]
    smallImage_contains: String
    smallImage_startsWith: String
    smallImage_endsWith: String
    smallImage_regex: String
    smallImage: String
    smallImage_ne: String
    smallImage_in: [String]
    mediumImage_contains: String
    mediumImage_startsWith: String
    mediumImage_endsWith: String
    mediumImage_regex: String
    mediumImage: String
    mediumImage_ne: String
    mediumImage_in: [String]
    authors_count: Int
    authors_textContains: String
    authors_startsWith: String
    authors_endsWith: String
    authors_regex: String
    authors: [String]
    authors_in: [[String]]
    authors_contains: String
    authors_containsAny: [String]
    authors_ne: [String]
    OR: [BookSummaryFilters]
  }
  
`;
  
  
export const mutation = `



`;


export const query = `

  allBookSummarys (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    title_contains: String,
    title_startsWith: String,
    title_endsWith: String,
    title_regex: String,
    title: String,
    title_ne: String,
    title_in: [String],
    asin_contains: String,
    asin_startsWith: String,
    asin_endsWith: String,
    asin_regex: String,
    asin: String,
    asin_ne: String,
    asin_in: [String],
    isbn_contains: String,
    isbn_startsWith: String,
    isbn_endsWith: String,
    isbn_regex: String,
    isbn: String,
    isbn_ne: String,
    isbn_in: [String],
    ean_contains: String,
    ean_startsWith: String,
    ean_endsWith: String,
    ean_regex: String,
    ean: String,
    ean_ne: String,
    ean_in: [String],
    smallImage_contains: String,
    smallImage_startsWith: String,
    smallImage_endsWith: String,
    smallImage_regex: String,
    smallImage: String,
    smallImage_ne: String,
    smallImage_in: [String],
    mediumImage_contains: String,
    mediumImage_startsWith: String,
    mediumImage_endsWith: String,
    mediumImage_regex: String,
    mediumImage: String,
    mediumImage_ne: String,
    mediumImage_in: [String],
    authors_count: Int,
    authors_textContains: String,
    authors_startsWith: String,
    authors_endsWith: String,
    authors_regex: String,
    authors: [String],
    authors_in: [[String]],
    authors_contains: String,
    authors_containsAny: [String],
    authors_ne: [String],
    OR: [BookSummaryFilters],
    SORT: BookSummarySort,
    SORTS: [BookSummarySort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): BookSummaryQueryResults

  getBookSummary (
    _id: String
  ): BookSummarySingleQueryResult

`;
  
