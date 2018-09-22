import { query as BookQuery, mutation as BookMutation, type as BookType } from './Book/schema';
import { query as BookSummaryQuery, mutation as BookSummaryMutation, type as BookSummaryType } from './BookSummary/schema';
import { query as LabelColorQuery, mutation as LabelColorMutation, type as LabelColorType } from './LabelColor/schema';
import { query as PublicUserQuery, mutation as PublicUserMutation, type as PublicUserType } from './PublicUser/schema';
import { query as SubjectQuery, mutation as SubjectMutation, type as SubjectType } from './Subject/schema';
import { query as TagQuery, mutation as TagMutation, type as TagType } from './Tag/schema';
import { query as UserQuery, mutation as UserMutation, type as UserType } from './User/schema';
import { type as EditorialReviewType } from './EditorialReview/schema';
    
export default `
  scalar JSON

  type QueryResultsMetadata {
    count: Int
  }

  input StringArrayUpdate {
    index: Int,
    value: String
  }

  input IntArrayUpdate {
    index: Int,
    value: Int
  }

  input FloatArrayUpdate {
    index: Int,
    value: Float
  }

  ${BookType}

  ${BookSummaryType}

  ${EditorialReviewType}

  ${LabelColorType}

  ${PublicUserType}

  ${SubjectType}

  ${TagType}

  ${UserType}

  type Query {
    ${BookQuery}

    ${BookSummaryQuery}

    ${LabelColorQuery}

    ${PublicUserQuery}

    ${SubjectQuery}

    ${TagQuery}

    ${UserQuery}
  }

  type Mutation {
    ${BookMutation}

    ${BookSummaryMutation}

    ${LabelColorMutation}

    ${PublicUserMutation}

    ${SubjectMutation}

    ${TagMutation}

    ${UserMutation}
  }

`