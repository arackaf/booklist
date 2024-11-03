import SchemaExtras1 from "../../graphQL-custom/custom-content/subject/schema";

export const type = `
  
  type Subject {
    _id: String!
    name: String!
    path: String
    userId: String
    backgroundColor: String
    textColor: String
    timestamp: Float
  }

  type SubjectQueryResults {
    Subjects: [Subject!]!
    Meta: QueryResultsMetadata!
  }

  type SubjectSingleQueryResult {
    Subject: Subject
  }

  type SubjectMutationResult {
    Subject: Subject
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type SubjectMutationResultMulti {
    Subjects: [Subject]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type SubjectBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input SubjectInput {
    _id: String
    name: String!
    path: String
    userId: String
    backgroundColor: String
    textColor: String
    timestamp: Float
  }

  input SubjectMutationInput {
    name: String
    path: String
    userId: String
    backgroundColor: String
    textColor: String
    timestamp: Float
    timestamp_INC: Int
    timestamp_DEC: Int
  }

  input SubjectSort {
    _id: Int
    name: Int
    path: Int
    userId: Int
    backgroundColor: Int
    textColor: Int
    timestamp: Int
  }

  input SubjectFilters {
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
    OR: [SubjectFilters]
  }
  
`;

export const mutation = `

  createSubject (
    Subject: SubjectInput
  ): SubjectMutationResult

  ${SchemaExtras1.Mutation || ""}

`;

export const query = `

  allSubjects (
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
    OR: [SubjectFilters],
    SORT: SubjectSort,
    SORTS: [SubjectSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    publicUserId: String,
    ver: String,
    cache: Int
  ): SubjectQueryResults!

  getSubject (
    _id: String,
    publicUserId: String,
    ver: String,
    cache: Int
  ): SubjectSingleQueryResult!

  ${SchemaExtras1.Query || ""}

`;
