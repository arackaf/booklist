export const type = `
  
  type User {
    _id: String
    isPublic: String
    publicName: String
    publicBooksHeader: String
  }
  
  type UserQueryResults {
    Users: [User],
    Meta: QueryResultsMetadata
  }

  type UserSingleQueryResult {
    User: User
  }

  type UserMutationResult {
    success: Boolean
    User: User
  }
  
  type UserMutationResultMulti {
    success: Boolean
    Users: [User]
  }  

  type UserBulkMutationResult {
    success: Boolean
  }  

  input UserInput {
    _id: String
    isPublic: String
    publicName: String
    publicBooksHeader: String
  }
  
  input UserMutationInput {
    isPublic: String
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
    isPublic_contains: String
    isPublic_startsWith: String
    isPublic_endsWith: String
    isPublic_regex: String
    isPublic: String
    isPublic_ne: String
    isPublic_in: [String]
    publicName_contains: String
    publicName_startsWith: String
    publicName_endsWith: String
    publicName_regex: String
    publicName: String
    publicName_ne: String
    publicName_in: [String]
    publicBooksHeader_contains: String
    publicBooksHeader_startsWith: String
    publicBooksHeader_endsWith: String
    publicBooksHeader_regex: String
    publicBooksHeader: String
    publicBooksHeader_ne: String
    publicBooksHeader_in: [String]
    OR: [UserFilters]
  }
  
`;
  
  
export const mutation = `

  updateUser(
    _id: String,
    Updates: UserMutationInput
  ): UserMutationResult
  
`;
  
  
export const query = `
  
  allUsers(
    _id: String,
    _id_ne: String,
    _id_in: [String],
    isPublic_contains: String,
    isPublic_startsWith: String,
    isPublic_endsWith: String,
    isPublic_regex: String,
    isPublic: String,
    isPublic_ne: String,
    isPublic_in: [String],
    publicName_contains: String,
    publicName_startsWith: String,
    publicName_endsWith: String,
    publicName_regex: String,
    publicName: String,
    publicName_ne: String,
    publicName_in: [String],
    publicBooksHeader_contains: String,
    publicBooksHeader_startsWith: String,
    publicBooksHeader_endsWith: String,
    publicBooksHeader_regex: String,
    publicBooksHeader: String,
    publicBooksHeader_ne: String,
    publicBooksHeader_in: [String],
    OR: [UserFilters],
    SORT: UserSort,
    SORTS: [UserSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): UserQueryResults

  getUser(
    _id: String
  ): UserSingleQueryResult
  
`;
  
  
  