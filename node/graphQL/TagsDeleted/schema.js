export const type = `
  
  type TagsDeleted {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  type TagsDeletedQueryResults {
    TagsDeleteds: [TagsDeleted!]!
    Meta: QueryResultsMetadata!
  }

  type TagsDeletedSingleQueryResult {
    TagsDeleted: TagsDeleted
  }

  type TagsDeletedMutationResult {
    TagsDeleted: TagsDeleted
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type TagsDeletedMutationResultMulti {
    TagsDeleteds: [TagsDeleted]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type TagsDeletedBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input TagsDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Float
  }

  input TagsDeletedMutationInput {
    userId: String
    deletedTimestamp: Float
    deletedTimestamp_INC: Int
    deletedTimestamp_DEC: Int
  }

  input TagsDeletedSort {
    _id: Int
    userId: Int
    deletedTimestamp: Int
  }

  input TagsDeletedFilters {
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
    deletedTimestamp_lt: Float
    deletedTimestamp_lte: Float
    deletedTimestamp_gt: Float
    deletedTimestamp_gte: Float
    deletedTimestamp: Float
    deletedTimestamp_ne: Float
    deletedTimestamp_in: [Float]
    OR: [TagsDeletedFilters]
  }
  
`;

export const mutation = `



`;

export const query = `

  allTagsDeleteds (
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
    deletedTimestamp_lt: Float,
    deletedTimestamp_lte: Float,
    deletedTimestamp_gt: Float,
    deletedTimestamp_gte: Float,
    deletedTimestamp: Float,
    deletedTimestamp_ne: Float,
    deletedTimestamp_in: [Float],
    OR: [TagsDeletedFilters],
    SORT: TagsDeletedSort,
    SORTS: [TagsDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): TagsDeletedQueryResults!

  getTagsDeleted (
    _id: String
  ): TagsDeletedSingleQueryResult!

`;
