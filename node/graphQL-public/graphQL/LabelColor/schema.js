export const type = `
  
  type LabelColor {
    _id: String
    backgroundColor: String
    order: Int
  }

  type LabelColorQueryResults {
    LabelColors: [LabelColor!]!
    Meta: QueryResultsMetadata!
  }

  type LabelColorSingleQueryResult {
    LabelColor: LabelColor
  }

  type LabelColorMutationResult {
    LabelColor: LabelColor
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type LabelColorMutationResultMulti {
    LabelColors: [LabelColor]
    success: Boolean!
    Meta: MutationResultInfo!
  }

  type LabelColorBulkMutationResult {
    success: Boolean!
    Meta: MutationResultInfo!
  }

  input LabelColorInput {
    _id: String
    backgroundColor: String
    order: Int
  }

  input LabelColorMutationInput {
    backgroundColor: String
    order: Int
    order_INC: Int
    order_DEC: Int
  }

  input LabelColorSort {
    _id: Int
    backgroundColor: Int
    order: Int
  }

  input LabelColorFilters {
    _id: String
    _id_ne: String
    _id_in: [String]
    _id_nin: [String]
    backgroundColor_contains: String
    backgroundColor_startsWith: String
    backgroundColor_endsWith: String
    backgroundColor_regex: String
    backgroundColor: String
    backgroundColor_ne: String
    backgroundColor_in: [String]
    backgroundColor_nin: [String]
    order_lt: Int
    order_lte: Int
    order_gt: Int
    order_gte: Int
    order: Int
    order_ne: Int
    order_in: [Int]
    order_nin: [Int]
    OR: [LabelColorFilters]
  }
  
`;

export const mutation = `



`;

export const query = `

  allLabelColors (
    _id: String,
    _id_ne: String,
    _id_in: [String],
    _id_nin: [String],
    backgroundColor_contains: String,
    backgroundColor_startsWith: String,
    backgroundColor_endsWith: String,
    backgroundColor_regex: String,
    backgroundColor: String,
    backgroundColor_ne: String,
    backgroundColor_in: [String],
    backgroundColor_nin: [String],
    order_lt: Int,
    order_lte: Int,
    order_gt: Int,
    order_gte: Int,
    order: Int,
    order_ne: Int,
    order_in: [Int],
    order_nin: [Int],
    OR: [LabelColorFilters],
    SORT: LabelColorSort,
    SORTS: [LabelColorSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int
  ): LabelColorQueryResults!

`;
