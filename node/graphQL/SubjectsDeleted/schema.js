export const type = `
  
  type SubjectsDeleted {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  type SubjectsDeletedQueryResults {
    SubjectsDeleteds: [SubjectsDeleted!]!
    Meta: QueryResultsMetadata!
  }

  type SubjectsDeletedSingleQueryResult {
    SubjectsDeleted: SubjectsDeleted
  }

  type SubjectsDeletedMutationResult {
    SubjectsDeleted: SubjectsDeleted
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type SubjectsDeletedMutationResultMulti {
    SubjectsDeleteds: [SubjectsDeleted]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type SubjectsDeletedBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input SubjectsDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  input SubjectsDeletedMutationInput {
    userId: String
    deletedTimestamp: Float
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
    _id_nin: [String]
    userId_contains: String
    userId_startsWith: String
    userId_endsWith: String
    userId_regex: String
    userId: String
    userId_ne: String
    userId_in: [String]
    userId_nin: [String]
    deletedTimestamp_lt: Float
    deletedTimestamp_lte: Float
    deletedTimestamp_gt: Float
    deletedTimestamp_gte: Float
    deletedTimestamp: Float
    deletedTimestamp_ne: Float
    deletedTimestamp_in: [Float]
    deletedTimestamp_nin: [Float]
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
    _id_nin: [String],
    userId_contains: String,
    userId_startsWith: String,
    userId_endsWith: String,
    userId_regex: String,
    userId: String,
    userId_ne: String,
    userId_in: [String],
    userId_nin: [String],
    deletedTimestamp_lt: Float,
    deletedTimestamp_lte: Float,
    deletedTimestamp_gt: Float,
    deletedTimestamp_gte: Float,
    deletedTimestamp: Float,
    deletedTimestamp_ne: Float,
    deletedTimestamp_in: [Float],
    deletedTimestamp_nin: [Float],
    OR: [SubjectsDeletedFilters],
    SORT: SubjectsDeletedSort,
    SORTS: [SubjectsDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): SubjectsDeletedQueryResults!

  getSubjectsDeleted (
    _id: String
  ): SubjectsDeletedSingleQueryResult!

`;
