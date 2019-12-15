import { query as BookQuery, mutation as BookMutation, type as BookType } from "./Book/schema";
import {
  query as BookSummaryQuery,
  mutation as BookSummaryMutation,
  type as BookSummaryType
} from "./BookSummary/schema";
import {
  query as BooksDeletedQuery,
  mutation as BooksDeletedMutation,
  type as BooksDeletedType
} from "./BooksDeleted/schema";
import { query as LabelColorQuery, mutation as LabelColorMutation, type as LabelColorType } from "./LabelColor/schema";
import { query as PublicUserQuery, mutation as PublicUserMutation, type as PublicUserType } from "./PublicUser/schema";
import { query as SubjectQuery, mutation as SubjectMutation, type as SubjectType } from "./Subject/schema";
import {
  query as SubjectsDeletedQuery,
  mutation as SubjectsDeletedMutation,
  type as SubjectsDeletedType
} from "./SubjectsDeleted/schema";
import { query as TagQuery, mutation as TagMutation, type as TagType } from "./Tag/schema";
import {
  query as TagsDeletedQuery,
  mutation as TagsDeletedMutation,
  type as TagsDeletedType
} from "./TagsDeleted/schema";
import { query as UserQuery, mutation as UserMutation, type as UserType } from "./User/schema";
import { type as EditorialReviewType } from "./EditorialReview/schema";

export default `

  scalar JSON

  type DeletionResultInfo {
    success: Boolean!,
    Meta: MutationResultInfo!
  }

  type MutationResultInfo {
    transaction: Boolean!,
    elapsedTime: Int!
  }

  type QueryResultsMetadata {
    count: Int!
  }

  type QueryRelationshipResultsMetadata {
    count: Int!
  }

  input StringArrayUpdate {
    index: Int!,
    value: String!
  }

  input IntArrayUpdate {
    index: Int!,
    value: Int!
  }

  input FloatArrayUpdate {
    index: Int!,
    value: Float!
  }


  ${BookType}

  ${BookSummaryType}

  ${BooksDeletedType}

  ${EditorialReviewType}

  ${LabelColorType}

  ${PublicUserType}

  ${SubjectType}

  ${SubjectsDeletedType}

  ${TagType}

  ${TagsDeletedType}

  ${UserType}

  type Query {
    ${BookQuery}

    ${BookSummaryQuery}

    ${BooksDeletedQuery}

    ${LabelColorQuery}

    ${PublicUserQuery}

    ${SubjectQuery}

    ${SubjectsDeletedQuery}

    ${TagQuery}

    ${TagsDeletedQuery}

    ${UserQuery}
  }

  type Mutation {
    ${BookMutation}

    ${SubjectMutation}

    ${TagMutation}

    ${UserMutation}
  }

`;
