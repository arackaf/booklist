export const type = `
  
  type User {
    _id: String
    isPublic: Boolean
    publicName: String
    publicBooksHeader: String
    books(FILTER: BookFilters, LIMIT: Int, SKIP: Int, PAGE: Int, PAGE_SIZE: Int, SORT: BookSort, SORTS: [BookSort], PREFER_LOOKUP: Boolean, DONT_PREFER_LOOKUP: Boolean): [Book!]!
    booksMeta(FILTER: BookFilters): QueryRelationshipResultsMetadata
  }

  type UserQueryResults {
    Users: [User!]!
    Meta: QueryResultsMetadata!
  }

  type UserSingleQueryResult {
    User: User
  }

  type UserMutationResult {
    User: User
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type UserMutationResultMulti {
    Users: [User]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type UserBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input UserInput {
    _id: String
    isPublic: Boolean
    publicName: String
    publicBooksHeader: String
  }

  input UserMutationInput {
    isPublic: Boolean
    publicName: String
    publicBooksHeader: String
  }

  input UserSort {
    _id: Int
    isPublic: Int
    publicName: Int
    publicBooksHeader: Int
  }

  input UserFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    _id_nin: [String]
    isPublic: Boolean
    isPublic_ne: Boolean
    isPublic_in: [Boolean]
    isPublic_nin: [Boolean]
    publicName_contains: String
    publicName_startsWith: String
    publicName_endsWith: String
    publicName_regex: String
    publicName: String
    publicName_ne: String
    publicName_in: [String]
    publicName_nin: [String]
    publicBooksHeader_contains: String
    publicBooksHeader_startsWith: String
    publicBooksHeader_endsWith: String
    publicBooksHeader_regex: String
    publicBooksHeader: String
    publicBooksHeader_ne: String
    publicBooksHeader_in: [String]
    publicBooksHeader_nin: [String]
    OR: [UserFilters]
  }
  
`;

export const mutation = `

  updateUser (
    _id: String,
    Updates: UserMutationInput
  ): UserMutationResult

`;

export const query = `

  allUsers (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    _id_nin: [String],
    isPublic: Boolean,
    isPublic_ne: Boolean,
    isPublic_in: [Boolean],
    isPublic_nin: [Boolean],
    publicName_contains: String,
    publicName_startsWith: String,
    publicName_endsWith: String,
    publicName_regex: String,
    publicName: String,
    publicName_ne: String,
    publicName_in: [String],
    publicName_nin: [String],
    publicBooksHeader_contains: String,
    publicBooksHeader_startsWith: String,
    publicBooksHeader_endsWith: String,
    publicBooksHeader_regex: String,
    publicBooksHeader: String,
    publicBooksHeader_ne: String,
    publicBooksHeader_in: [String],
    publicBooksHeader_nin: [String],
    OR: [UserFilters],
    SORT: UserSort,
    SORTS: [UserSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): UserQueryResults!

  getUser (
    _id: String
  ): UserSingleQueryResult!

`;
