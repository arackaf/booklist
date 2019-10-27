import GraphQLJSON from "graphql-type-json";

import Book, { Book as BookRest } from "./Book/resolver";
import BookSummary, { BookSummary as BookSummaryRest } from "./BookSummary/resolver";
import BooksDeleted, { BooksDeleted as BooksDeletedRest } from "./BooksDeleted/resolver";
import LabelColor, { LabelColor as LabelColorRest } from "./LabelColor/resolver";
import PublicUser, { PublicUser as PublicUserRest } from "./PublicUser/resolver";
import Subject, { Subject as SubjectRest } from "./Subject/resolver";
import SubjectsDeleted, { SubjectsDeleted as SubjectsDeletedRest } from "./SubjectsDeleted/resolver";
import Tag, { Tag as TagRest } from "./Tag/resolver";
import TagsDeleted, { TagsDeleted as TagsDeletedRest } from "./TagsDeleted/resolver";
import User, { User as UserRest } from "./User/resolver";

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: BookSummaryQuery, Mutation: BookSummaryMutation } = BookSummary;
const { Query: BooksDeletedQuery, Mutation: BooksDeletedMutation } = BooksDeleted;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: PublicUserQuery, Mutation: PublicUserMutation } = PublicUser;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: SubjectsDeletedQuery, Mutation: SubjectsDeletedMutation } = SubjectsDeleted;
const { Query: TagQuery, Mutation: TagMutation } = Tag;
const { Query: TagsDeletedQuery, Mutation: TagsDeletedMutation } = TagsDeleted;
const { Query: UserQuery, Mutation: UserMutation } = User;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    BookQuery,
    BookSummaryQuery,
    BooksDeletedQuery,
    LabelColorQuery,
    PublicUserQuery,
    SubjectQuery,
    SubjectsDeletedQuery,
    TagQuery,
    TagsDeletedQuery,
    UserQuery
  ),
  Mutation: Object.assign({}, BookMutation, SubjectMutation, TagMutation, UserMutation),
  Book: { ...BookRest },
  BookSummary: { ...BookSummaryRest },
  BooksDeleted: { ...BooksDeletedRest },
  LabelColor: { ...LabelColorRest },
  PublicUser: { ...PublicUserRest },
  Subject: { ...SubjectRest },
  SubjectsDeleted: { ...SubjectsDeletedRest },
  Tag: { ...TagRest },
  TagsDeleted: { ...TagsDeletedRest },
  User: { ...UserRest }
};
