export const type = `
  
  type PublicUser {
    _id: String
    isPublic: String
    publicName: String
    publicBooksHeader: String
  }

  type PublicUserQueryResults {
    PublicUsers: [PublicUser!]!
    Meta: QueryResultsMetadata!
  }

  type PublicUserSingleQueryResult {
    PublicUser: PublicUser
  }

  type PublicUserMutationResult {
    PublicUser: PublicUser
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type PublicUserMutationResultMulti {
    PublicUsers: [PublicUser]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type PublicUserBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input PublicUserInput {
    _id: String
    isPublic: String
    publicName: String
    publicBooksHeader: String
  }

  input PublicUserMutationInput {
    isPublic: String
    publicName: String
    publicBooksHeader: String
  }

  input PublicUserSort {
    _id: Int
    isPublic: Int
    publicName: Int
    publicBooksHeader: Int
  }

  input PublicUserFilters {
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
    OR: [PublicUserFilters]
  }
  
`;

export const mutation = `



`;

export const query = `

  allPublicUsers (
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
    OR: [PublicUserFilters],
    SORT: PublicUserSort,
    SORTS: [PublicUserSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    cache: Int
  ): PublicUserQueryResults!

  getPublicUser (
    _id: String,
    cache: Int
  ): PublicUserSingleQueryResult!

`;
