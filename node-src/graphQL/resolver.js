import GraphQLJSON from 'graphql-type-json';

import Book, { Book as BookRest } from './Book/resolver';
import BookSummary, { BookSummary as BookSummaryRest } from './BookSummary/resolver';
import LabelColor, { LabelColor as LabelColorRest } from './LabelColor/resolver';
import PublicUser, { PublicUser as PublicUserRest } from './PublicUser/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';
import Tag, { Tag as TagRest } from './Tag/resolver';
import User, { User as UserRest } from './User/resolver';

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: BookSummaryQuery, Mutation: BookSummaryMutation } = BookSummary;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: PublicUserQuery, Mutation: PublicUserMutation } = PublicUser;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: TagQuery, Mutation: TagMutation } = Tag;
const { Query: UserQuery, Mutation: UserMutation } = User;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    BookQuery,
    BookSummaryQuery,
    LabelColorQuery,
    PublicUserQuery,
    SubjectQuery,
    TagQuery,
    UserQuery
  ),
  Mutation: Object.assign({},
    BookMutation,
    BookSummaryMutation,
    LabelColorMutation,
    PublicUserMutation,
    SubjectMutation,
    TagMutation,
    UserMutation
  ),
  Book: {
    ...BookRest
  },
  BookSummary: {
    ...BookSummaryRest
  },
  LabelColor: {
    ...LabelColorRest
  },
  PublicUser: {
    ...PublicUserRest
  },
  Subject: {
    ...SubjectRest
  },
  Tag: {
    ...TagRest
  },
  User: {
    ...UserRest
  }
};

