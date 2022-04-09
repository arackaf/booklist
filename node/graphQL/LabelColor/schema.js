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
    OR: [LabelColorFilters],
    SORT: LabelColorSort,
    SORTS: [LabelColorSort],
    LIMIT: Int,
    SKIP: Int,
    PAGE: Int,
    PAGE_SIZE: Int,
    ver: String,
    cache: Int
  ): LabelColorQueryResults!

`;
