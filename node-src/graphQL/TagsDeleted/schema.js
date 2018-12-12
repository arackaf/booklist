export const type = `
  
  type TagsDeleted {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  type TagsDeletedQueryResults {
    TagsDeleteds: [TagsDeleted]
    Meta: QueryResultsMetadata
  }

  type TagsDeletedSingleQueryResult {
    TagsDeleted: TagsDeleted
  }

  type TagsDeletedMutationResult {
    success: Boolean
    TagsDeleted: TagsDeleted
  }

  type TagsDeletedMutationResultMulti {
    success: Boolean
    TagsDeleteds: [TagsDeleted]
  }

  type TagsDeletedBulkMutationResult {
    success: Boolean
  }

  input TagsDeletedInput {
    _id: String
    userId: String
    deletedTimestamp: Int
  }

  input TagsDeletedMutationInput {
    userId: String
    deletedTimestamp: Int
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
    deletedTimestamp_lt: Int
    deletedTimestamp_lte: Int
    deletedTimestamp_gt: Int
    deletedTimestamp_gte: Int
    deletedTimestamp: Int
    deletedTimestamp_ne: Int
    deletedTimestamp_in: [Int]
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
    deletedTimestamp_lt: Int,
    deletedTimestamp_lte: Int,
    deletedTimestamp_gt: Int,
    deletedTimestamp_gte: Int,
    deletedTimestamp: Int,
    deletedTimestamp_ne: Int,
    deletedTimestamp_in: [Int],
    OR: [TagsDeletedFilters],
    SORT: TagsDeletedSort,
    SORTS: [TagsDeletedSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): TagsDeletedQueryResults

  getTagsDeleted (
    _id: String
  ): TagsDeletedSingleQueryResult

`;
  
