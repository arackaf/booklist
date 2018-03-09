import { query as BookQuery, mutation as BookMutation, type as BookType } from './Book/schema';
import { query as SubjectQuery, mutation as SubjectMutation, type as SubjectType } from './Subject/schema';
import { query as LabelColorQuery, mutation as LabelColorMutation, type as LabelColorType } from './LabelColor/schema';
    
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

  type Query {
    ${BookQuery}

    ${SubjectQuery}

    ${LabelColorQuery}
  }

  type Mutation {
    ${BookMutation}

    ${SubjectMutation}

    ${LabelColorMutation}
  }

`