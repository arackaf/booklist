import GraphQLJSON from "graphql-type-json";

import Book, { Book as BookRest } from "./Book/resolver";
import BookSummary, { BookSummary as BookSummaryRest } from "./BookSummary/resolver";
import BooksDeleted, { BooksDeleted as BooksDeletedRest } from "./BooksDeleted/resolver";
import LabelColor, { LabelColor as LabelColorRest } from "./LabelColor/resolver";
import Subject, { Subject as SubjectRest } from "./Subject/resolver";
import SubjectsDeleted, { SubjectsDeleted as SubjectsDeletedRest } from "./SubjectsDeleted/resolver";
import Tag, { Tag as TagRest } from "./Tag/resolver";
import TagsDeleted, { TagsDeleted as TagsDeletedRest } from "./TagsDeleted/resolver";

import resolverAddition1 from "/Users/arackis/Documents/git/booklist/node/graphQL-custom/custom-content/userResolver.js";

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: BookSummaryQuery, Mutation: BookSummaryMutation } = BookSummary;
const { Query: BooksDeletedQuery, Mutation: BooksDeletedMutation } = BooksDeleted;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: SubjectsDeletedQuery, Mutation: SubjectsDeletedMutation } = SubjectsDeleted;
const { Query: TagQuery, Mutation: TagMutation } = Tag;
const { Query: TagsDeletedQuery, Mutation: TagsDeletedMutation } = TagsDeleted;

const { Query: queryAddition1 = {}, Mutation: mutationAddition1 = {}, ...restAdditions1 } = resolverAddition1;

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
    queryAddition1
  ),
  Mutation: Object.assign({}, BookMutation, BookSummaryMutation, SubjectMutation, TagMutation, mutationAddition1),
  Book: { ...BookRest },
  BookSummary: { ...BookSummaryRest },
  BooksDeleted: { ...BooksDeletedRest },
  LabelColor: { ...LabelColorRest },
  Subject: { ...SubjectRest },
  SubjectsDeleted: { ...SubjectsDeletedRest },
  Tag: { ...TagRest },
  TagsDeleted: { ...TagsDeletedRest },
  ...restAdditions1
};
