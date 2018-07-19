import GraphQLJSON from "graphql-type-json";

import Book, { Book as BookRest } from "./Book/resolver";
import Subject, { Subject as SubjectRest } from "./Subject/resolver";
import LabelColor, { LabelColor as LabelColorRest } from "./LabelColor/resolver";
import Tag, { Tag as TagRest } from "./Tag/resolver";

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: TagQuery, Mutation: TagMutation } = Tag;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign({}, BookQuery, SubjectQuery, LabelColorQuery, TagQuery),
  Mutation: Object.assign({}, BookMutation, SubjectMutation, LabelColorMutation, TagMutation),
  Book: {
    ...BookRest
  },
  Subject: {
    ...SubjectRest
  },
  LabelColor: {
    ...LabelColorRest
  },
  Tag: {
    ...TagRest
  }
};
