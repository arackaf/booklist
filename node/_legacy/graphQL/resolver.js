import GraphQLJSON from "graphql-type-json";

import Book, { Book as BookRest } from "./Book/resolver.js";
import BookSummary, { BookSummary as BookSummaryRest } from "./BookSummary/resolver.js";
import BooksDeleted, { BooksDeleted as BooksDeletedRest } from "./BooksDeleted/resolver.js";
import LabelColor, { LabelColor as LabelColorRest } from "./LabelColor/resolver.js";
import Subject, { Subject as SubjectRest } from "./Subject/resolver.js";
import SubjectsDeleted, { SubjectsDeleted as SubjectsDeletedRest } from "./SubjectsDeleted/resolver.js";
import Tag, { Tag as TagRest } from "./Tag/resolver.js";
import TagsDeleted, { TagsDeleted as TagsDeletedRest } from "./TagsDeleted/resolver.js";

import resolverAddition1 from "../graphQL-custom/custom-content/user/resolver.js";
import resolverAddition2 from "../graphQL-custom/custom-content/recently-scanned/resolver.js";

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: BookSummaryQuery, Mutation: BookSummaryMutation } = BookSummary;
const { Query: BooksDeletedQuery, Mutation: BooksDeletedMutation } = BooksDeleted;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: SubjectsDeletedQuery, Mutation: SubjectsDeletedMutation } = SubjectsDeleted;
const { Query: TagQuery, Mutation: TagMutation } = Tag;
const { Query: TagsDeletedQuery, Mutation: TagsDeletedMutation } = TagsDeleted;

const { Query: queryAddition1 = {}, Mutation: mutationAddition1 = {}, ...restAdditions1 } = resolverAddition1;
const { Query: queryAddition2 = {}, Mutation: mutationAddition2 = {}, ...restAdditions2 } = resolverAddition2;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    BookQuery,
    BookSummaryQuery,
    BooksDeletedQuery,
    LabelColorQuery,
    SubjectQuery,
    SubjectsDeletedQuery,
    TagQuery,
    TagsDeletedQuery,
    queryAddition1,
    queryAddition2
  ),
  Mutation: Object.assign({}, BookMutation, BookSummaryMutation, SubjectMutation, TagMutation, mutationAddition1, mutationAddition2),
  Book: { ...BookRest },
  BookSummary: { ...BookSummaryRest },
  BooksDeleted: { ...BooksDeletedRest },
  LabelColor: { ...LabelColorRest },
  Subject: { ...SubjectRest },
  SubjectsDeleted: { ...SubjectsDeletedRest },
  Tag: { ...TagRest },
  TagsDeleted: { ...TagsDeletedRest },
  ...restAdditions1,
  ...restAdditions2
};
