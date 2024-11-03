export const type = `
  
  type Tag {
    _id: String!
    name: String!
    path: String
    userId: String
    backgroundColor: String!
    textColor: String!
    timestamp: Float
  }

  type TagQueryResults {
    Tags: [Tag!]!
    Meta: QueryResultsMetadata!
  }

  type TagSingleQueryResult {
    Tag: Tag
  }

  type TagMutationResult {
    Tag: Tag
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type TagMutationResultMulti {
    Tags: [Tag]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type TagBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input TagInput {
    _id: String
    name: String!
    path: String
    userId: String
    backgroundColor: String!
    textColor: String!
    timestamp: Float
  }

  input TagMutationInput {
    name: String
    path: String
    userId: String
    backgroundColor: String
    textColor: String
    timestamp: Float
    timestamp_INC: Int
    timestamp_DEC: Int
  }

  input TagSort {
    _id: Int
    name: Int
    path: Int
    userId: Int
    backgroundColor: Int
    textColor: Int
    timestamp: Int
  }

  input TagFilters {
    name_contains: String
    name_startsWith: String
    name_endsWith: String
    name_regex: String
    name: String
    name_ne: String
    name_in: [String]
    name_nin: [String]
    path_contains: String
    path_startsWith: String
    path: String
    userId: String
    userId_in: [String]
    timestamp_lt: Float
    timestamp_gt: Float
    OR: [TagFilters]
  }
  
`;

export const mutation = `

  createTag (
    Tag: TagInput
  ): TagMutationResult

  updateTag (
    _id: String,
    Updates: TagMutationInput
  ): TagMutationResult

  updateTags (
    _ids: [String],
    Updates: TagMutationInput
  ): TagMutationResultMulti

  updateTagsBulk (
    Match: TagFilters,
    Updates: TagMutationInput
  ): TagBulkMutationResult

  deleteTag (
    _id: String
  ): DeletionResultInfo

`;

export const query = `

  allTags (
    name_contains: String,
    name_startsWith: String,
    name_endsWith: String,
    name_regex: String,
    name: String,
    name_ne: String,
    name_in: [String],
    name_nin: [String],
    path_contains: String,
    path_startsWith: String,
    path: String,
    userId: String,
    userId_in: [String],
    timestamp_lt: Float,
    timestamp_gt: Float,
    OR: [TagFilters],
    SORT: TagSort,
    SORTS: [TagSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    publicUserId: String,
    ver: String,
    cache: Int
  ): TagQueryResults!

  getTag (
    _id: String,
    publicUserId: String,
    ver: String,
    cache: Int
  ): TagSingleQueryResult!

`;
