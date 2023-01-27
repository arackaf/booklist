import type { Readable } from "svelte/store";

export type Subject = {
  _id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
  path: string | null;
};

export type DisablableSubject = Subject & {
  disabled: boolean;
};

export type FullSubject = Subject & {
  children: FullSubject[];
  childLevel: number;
};

export type Hash<T> = {
  [_id: string]: T;
};

export type Tag = {
  _id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
};

export type TagEditFields = Omit<Tag, "_id">;

export type PreviewPacket = { w: number; h: number; b64: string };

export type BookSubjectStack = { subjects: string[]; count: number };

export type Book = {
  _id: string;
  title: string;
  pages?: number;
  isbn: string;
  publisher: string;
  publicationDate: string;
  dateAddedDisplay: string;
  isRead: boolean;
  authors: string[];
  tags: string[];
  subjects: string[];
  mobileImage: string | null;
  mobileImagePreview: string | PreviewPacket | null;
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  mediumImage: string | null;
  mediumImagePreview: string | PreviewPacket | null;
  dateAdded: string;
};

export type BookCoversEdits = Partial<
  Pick<Book, "mobileImage" | "mobileImagePreview" | "smallImage" | "smallImagePreview" | "mediumImage" | "mediumImagePreview">
>;

export type BookDisplay = Book & {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
};

type BookSortKeys = "_id" | "title" | "pages";
type BookSortValue = Partial<{
  [k in BookSortKeys]: number;
}>;

export type BookSearch = {
  publicUser: string;
  page: number;
  search: string;
  publisher: string;
  author: string;
  isRead?: boolean;
  tags: string[];
  subjects: string[];
  searchChildSubjects: true | undefined;
  noSubjects: boolean;
  sort?: BookSortValue;
  pageSize?: number;
  resultSet?: string;
};

type EditorialReview = {
  source: string;
  content: string;
};

type SimilarBook = {
  title: string;
  authors: string[];
  smallImage: string;
  smallImagePreview: string;
  asin: string;
};

export type BookDetails = {
  editorialReviews: EditorialReview[];
  similarBooks: SimilarBook[];
};

export type Color = {
  _id: string;
  backgroundColor: string;
  order: number;
};

export type UnwrapReadable<T> = T extends Readable<infer U> ? U : never;
