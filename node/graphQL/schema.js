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

  ${SubjectType}

  ${SubjectsDeletedType}

  ${TagType}

  ${TagsDeletedType}

  type Query {
    ${BookQuery}

    ${BookSummaryQuery}

    ${BooksDeletedQuery}

    ${LabelColorQuery}

    ${SubjectQuery}

    ${SubjectsDeletedQuery}

    ${TagQuery}

    ${TagsDeletedQuery}
  }

  type Mutation {
    ${BookMutation}

    ${BookSummaryMutation}

    ${SubjectMutation}

    ${TagMutation}
  }

  type User {
  email: String
  userId: String
  isPublic: Boolean
  publicName: String
  publicBooksHeader: String
}

type PublicUser {
  email: String
  isPublic: Boolean
  publicName: String
  publicBooksHeader: String
}

type UserSingleQueryResult {
  User: User
}

type PublicUserSingleQueryResult {
  PublicUser: User
}

extend type Query {
  getUser: UserSingleQueryResult
  getPublicUser(userId: String): PublicUserSingleQueryResult
}

input UserUpdates {
  isPublic: Boolean
  publicBooksHeader: String
  publicName: String
}

extend type Mutation {
  updateUser(Updates: UserUpdates): UserSingleQueryResult
}


type ScanResult {
  success: Boolean
  isbn: String
  title: String
  smallImage: String
}

type DynamoKey {
  pk: String
  sk: String
}

input DynamoKeyInput {
  pk: String
  sk: String
}

type ScanResults {
  ScanResults: [ScanResult]
  LastEvaluatedKey: DynamoKey
}

extend type Query {
  recentScanResults(exclusiveStartKey: DynamoKeyInput): ScanResults
}


`;
