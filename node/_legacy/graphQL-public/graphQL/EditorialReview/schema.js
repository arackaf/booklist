export const type = `
  
  type EditorialReview {
    source: String
    content: String
  }

  input EditorialReviewInput {
    source: String
    content: String
  }

  input EditorialReviewMutationInput {
    source: String
    content: String
  }

  input EditorialReviewArrayMutationInput {
    index: Int
    Updates: EditorialReviewMutationInput
  }

  input EditorialReviewSort {
    source: Int
    content: Int
  }

  input EditorialReviewFilters {
    source_contains: String
    source_startsWith: String
    source_endsWith: String
    source_regex: String
    source: String
    source_ne: String
    source_in: [String]
    source_nin: [String]
    content_contains: String
    content_startsWith: String
    content_endsWith: String
    content_regex: String
    content: String
    content_ne: String
    content_in: [String]
    content_nin: [String]
    OR: [EditorialReviewFilters]
  }
  
`;
