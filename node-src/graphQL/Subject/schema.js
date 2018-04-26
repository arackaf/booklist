import SchemaExtras1 from "../../graphQL-custom/extras/subject/schema";

export const type = `
  
  type Subject {
    _id: String
    name: String
    path: String
    userId: String
    backgroundColor: String
    textColor: String
  }

  type SubjectQueryResults {
    Subjects: [Subject]
    Meta: QueryResultsMetadata
  }

  type SubjectSingleQueryResult {
    Subject: Subject
  }

  type SubjectMutationResult {
    success: Boolean
    Subject: Subject
  }

  type SubjectMutationResultMulti {
    success: Boolean
    Subjects: [Subject]
  }

  type SubjectBulkMutationResult {
    success: Boolean
  }

  input SubjectInput {
    _id: String
    name: String
    path: String
    userId: String
    backgroundColor: String
    textColor: String
  }

  input SubjectMutationInput {
    name: String
    path: String
    userId: String
    backgroundColor: String
    textColor: String
  }

  input SubjectSort {
    _id: Int
    name: Int
    path: Int
    userId: Int
    backgroundColor: Int
    textColor: Int
  }

  input SubjectFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    name_contains: String
    name_startsWith: String
    name_endsWith: String
    name_regex: String
    name: String
    name_ne: String
    name_in: [String]
    path_contains: String
    path_startsWith: String
    path_endsWith: String
    path_regex: String
    path: String
    path_ne: String
    path_in: [String]
    userId_contains: String
    userId_startsWith: String
    userId_endsWith: String
    userId_regex: String
    userId: String
    userId_ne: String
    userId_in: [String]
    backgroundColor_contains: String
    backgroundColor_startsWith: String
    backgroundColor_endsWith: String
    backgroundColor_regex: String
    backgroundColor: String
    backgroundColor_ne: String
    backgroundColor_in: [String]
    textColor_contains: String
    textColor_startsWith: String
    textColor_endsWith: String
    textColor_regex: String
    textColor: String
    textColor_ne: String
    textColor_in: [String]
    OR: [SubjectFilters]
  }
  
`;
  
  
export const mutation = `

  createSubject (
    Subject: SubjectInput
  ): SubjectMutationResult

  deleteSubject (
    _id: String
  ): Boolean

  ${SchemaExtras1.Mutation || ""}

`;


export const query = `

  allSubjects (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    name_contains: String,
    name_startsWith: String,
    name_endsWith: String,
    name_regex: String,
    name: String,
    name_ne: String,
    name_in: [String],
    path_contains: String,
    path_startsWith: String,
    path_endsWith: String,
    path_regex: String,
    path: String,
    path_ne: String,
    path_in: [String],
    userId_contains: String,
    userId_startsWith: String,
    userId_endsWith: String,
    userId_regex: String,
    userId: String,
    userId_ne: String,
    userId_in: [String],
    backgroundColor_contains: String,
    backgroundColor_startsWith: String,
    backgroundColor_endsWith: String,
    backgroundColor_regex: String,
    backgroundColor: String,
    backgroundColor_ne: String,
    backgroundColor_in: [String],
    textColor_contains: String,
    textColor_startsWith: String,
    textColor_endsWith: String,
    textColor_regex: String,
    textColor: String,
    textColor_ne: String,
    textColor_in: [String],
    OR: [SubjectFilters],
    SORT: SubjectSort,
    SORTS: [SubjectSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    publicUserId: String
  ): SubjectQueryResults

  getSubject (
    _id: String,
    publicUserId: String
  ): SubjectSingleQueryResult

  ${SchemaExtras1.Query || ""}

`;
  
