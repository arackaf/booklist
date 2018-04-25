import { query as BookQuery, mutation as BookMutation, type as BookType } from './Book/schema';
import { query as SubjectQuery, mutation as SubjectMutation, type as SubjectType } from './Subject/schema';
import { query as LabelColorQuery, mutation as LabelColorMutation, type as LabelColorType } from './LabelColor/schema';
import { query as UserQuery, mutation as UserMutation, type as UserType } from './User/schema';
import { query as PublicUserQuery, mutation as PublicUserMutation, type as PublicUserType } from './PublicUser/schema';
    
export default `

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

  ${SubjectType}

  ${LabelColorType}

  ${UserType}

  ${PublicUserType}

  type Query {
    ${BookQuery}

    ${SubjectQuery}

    ${LabelColorQuery}

    ${UserQuery}

    ${PublicUserQuery}
  }

  type Mutation {
    ${BookMutation}

    ${SubjectMutation}

    ${LabelColorMutation}

    ${UserMutation}

    ${PublicUserMutation}
  }

`