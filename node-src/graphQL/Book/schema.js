export const type = `
  
  type Book {
    _id: String
    ean: String
    isbn: String
    title: String
    smallImage: String
    mediumImage: String
    userId: String
    publisher: String
    publicationDate: String
    pages: String
    authors: [String]
    subjects: [String]
    tags: [String]
    isRead: [String]
  
  }
  
  type BookQueryResults {
    Books: [Book],
    Meta: QueryResultsMetadata
  }

  type BookSingleQueryResult {
    Book: Book
  }

  type BookMutationResult {
    Book: Book
  }

  input BookInput {
    _id: String
    ean: String
    isbn: String
    title: String
    smallImage: String
    mediumImage: String
    userId: String
    publisher: String
    publicationDate: String
    pages: String
    authors: [String]
    subjects: [String]
    tags: [String]
    isRead: [String]
  }
  
  input BookMutationInput {
    ean: String
    isbn: String
    title: String
    smallImage: String
    mediumImage: String
    userId: String
    publisher: String
    publicationDate: String
    pages: String
    authors: [String]
    authors_PUSH: String
    authors_CONCAT: [String]
    authors_UPDATE: StringArrayUpdate
    authors_UPDATES: [StringArrayUpdate]
    authors_PULL: [String]
    subjects: [String]
    subjects_PUSH: String
    subjects_CONCAT: [String]
    subjects_UPDATE: StringArrayUpdate
    subjects_UPDATES: [StringArrayUpdate]
    subjects_PULL: [String]
    tags: [String]
    tags_PUSH: String
    tags_CONCAT: [String]
    tags_UPDATE: StringArrayUpdate
    tags_UPDATES: [StringArrayUpdate]
    tags_PULL: [String]
    isRead: [String]
    isRead_PUSH: String
    isRead_CONCAT: [String]
    isRead_UPDATE: StringArrayUpdate
    isRead_UPDATES: [StringArrayUpdate]
    isRead_PULL: [String]
  }
  
  input BookSort {
    _id: Int
    ean: Int
    isbn: Int
    title: Int
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
  }
      
  input BookFilters {
    _id: String
    _id_in: [String]
    ean_contains: String
    ean_startsWith: String
    ean_endsWith: String
    ean: String
    ean_in: [String]
    isbn_contains: String
    isbn_startsWith: String
    isbn_endsWith: String
    isbn: String
    isbn_in: [String]
    title_contains: String
    title_startsWith: String
    title_endsWith: String
    title: String
    title_in: [String]
    smallImage_contains: String
    smallImage_startsWith: String
    smallImage_endsWith: String
    smallImage: String
    smallImage_in: [String]
    mediumImage_contains: String
    mediumImage_startsWith: String
    mediumImage_endsWith: String
    mediumImage: String
    mediumImage_in: [String]
    userId_contains: String
    userId_startsWith: String
    userId_endsWith: String
    userId: String
    userId_in: [String]
    publisher_contains: String
    publisher_startsWith: String
    publisher_endsWith: String
    publisher: String
    publisher_in: [String]
    publicationDate_contains: String
    publicationDate_startsWith: String
    publicationDate_endsWith: String
    publicationDate: String
    publicationDate_in: [String]
    pages_contains: String
    pages_startsWith: String
    pages_endsWith: String
    pages: String
    pages_in: [String]
    authors: [String]
    authors_in: [[String]]
    authors_contains: String
    subjects: [String]
    subjects_in: [[String]]
    subjects_contains: String
    tags: [String]
    tags_in: [[String]]
    tags_contains: String
    isRead: [String]
    isRead_in: [[String]]
    isRead_contains: String
    OR: [BookFilters]
  }
  
  `;
  
  
  export const mutation = `
  
    createBook(
      Book: BookInput
    ): BookMutationResult
  
    updateBook(
      _id: String,
      Book: BookMutationInput
    ): BookMutationResult
  
    deleteBook(
      _id: String
    ): Boolean
  
  `;
  
  
  export const query = `
  
    allBooks(
      _id: String,
      _id_in: [String],
      ean_contains: String,
      ean_startsWith: String,
      ean_endsWith: String,
      ean: String,
      ean_in: [String],
      isbn_contains: String,
      isbn_startsWith: String,
      isbn_endsWith: String,
      isbn: String,
      isbn_in: [String],
      title_contains: String,
      title_startsWith: String,
      title_endsWith: String,
      title: String,
      title_in: [String],
      smallImage_contains: String,
      smallImage_startsWith: String,
      smallImage_endsWith: String,
      smallImage: String,
      smallImage_in: [String],
      mediumImage_contains: String,
      mediumImage_startsWith: String,
      mediumImage_endsWith: String,
      mediumImage: String,
      mediumImage_in: [String],
      userId_contains: String,
      userId_startsWith: String,
      userId_endsWith: String,
      userId: String,
      userId_in: [String],
      publisher_contains: String,
      publisher_startsWith: String,
      publisher_endsWith: String,
      publisher: String,
      publisher_in: [String],
      publicationDate_contains: String,
      publicationDate_startsWith: String,
      publicationDate_endsWith: String,
      publicationDate: String,
      publicationDate_in: [String],
      pages_contains: String,
      pages_startsWith: String,
      pages_endsWith: String,
      pages: String,
      pages_in: [String],
      authors: [String],
      authors_in: [[String]],
      authors_contains: String,
      subjects: [String],
      subjects_in: [[String]],
      subjects_contains: String,
      tags: [String],
      tags_in: [[String]],
      tags_contains: String,
      isRead: [String],
      isRead_in: [[String]],
      isRead_contains: String,
      OR: [BookFilters],
      SORT: BookSort,
      SORTS: [BookSort],
      LIMIT: Int,
      SKIP: Int,
      PAGE: Int,
      PAGE_SIZE: Int
    ): BookQueryResults
  
    getBook(
      _id: String
    ): BookSingleQueryResult
  
  `;
  
  
  