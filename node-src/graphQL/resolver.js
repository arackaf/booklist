import Book, { Book as BookRest } from './Book/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';
import LabelColor, { LabelColor as LabelColorRest } from './LabelColor/resolver';

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;

export default {
  Query: Object.assign(
    {},
    BookQuery,
    SubjectQuery,
    LabelColorQuery
  ),
  Mutation: Object.assign({},
    BookMutation,
    SubjectMutation,
    LabelColorMutation
  ),
  Book: {
    ...BookRest
  },
  Subject: {
    ...SubjectRest
  },
  LabelColor: {
    ...LabelColorRest
  }
};

