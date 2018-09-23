import GraphQLJSON from 'graphql-type-json';

import Book, { Book as BookRest } from './Book/resolver';
import LabelColor, { LabelColor as LabelColorRest } from './LabelColor/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';
import Tag, { Tag as TagRest } from './Tag/resolver';

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: TagQuery, Mutation: TagMutation } = Tag;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    BookQuery,
    LabelColorQuery,
    SubjectQuery,
    TagQuery
  ),
  Mutation: Object.assign({},
    BookMutation,
    LabelColorMutation,
    SubjectMutation,
    TagMutation
  ),
  Book: {
    ...BookRest
  },
  LabelColor: {
    ...LabelColorRest
  },
  Subject: {
    ...SubjectRest
  },
  Tag: {
    ...TagRest
  }
};

