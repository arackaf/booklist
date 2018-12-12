export const type = `
  
  type SubjectsDeleted {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  type SubjectsDeletedQueryResults {
    SubjectsDeleteds: [SubjectsDeleted]
    Meta: QueryResultsMetadata
  }

  type SubjectsDeletedSingleQueryResult {
    SubjectsDeleted: SubjectsDeleted
  }

  type SubjectsDeletedMutationResult {
    success: Boolean
    SubjectsDeleted: SubjectsDeleted
  }

  type SubjectsDeletedMutationResultMulti {
    success: Boolean
    SubjectsDeleteds: [SubjectsDeleted]
  }

  type SubjectsDeletedBulkMutationResult {
    success: Boolean
  }

  input SubjectsDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  input SubjectsDeletedMutationInput {
    userId: String
    deletedTimestamp: Int
    deletedTimestamp_INC: Int
    deletedTimestamp_DEC: Int
  }

  input SubjectsDeletedSort {
    _id: Int
    userId: Int
    deletedTimestamp: Int
  }

  input SubjectsDeletedFilters {
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
    OR: [SubjectsDeletedFilters]
  }
  
`;
  
  
export const mutation = `



`;


export const query = `

  allSubjectsDeleteds (
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
    OR: [SubjectsDeletedFilters],
    SORT: SubjectsDeletedSort,
    SORTS: [SubjectsDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): SubjectsDeletedQueryResults

  getSubjectsDeleted (
    _id: String
  ): SubjectsDeletedSingleQueryResult

`;
  
