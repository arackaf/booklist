import type { Readable } from "svelte/store";

export type Label = {
  id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
};

export type Subject = Label & {
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
  [id: string]: T;
};

export type Tag = Label;

export type TagEditFields = Omit<Tag, "id">;

export type PreviewPacket = { w: number; h: number; b64: string };

export type BookSubjectStack = { subjects: string[]; count: number };

export type Book = {
  id: string;
  title: string;
  pages?: number;
  isbn: string;
  publisher: string;
  publicationDate: string;
  dateAddedDisplay: string;
  isRead: boolean;
  authors: string[];
  tags: number[];
  subjects: number[];
  mobileImage: string | null;
  mobileImagePreview: string | PreviewPacket | null;
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  mediumImage: string | null;
  mediumImagePreview: string | PreviewPacket | null;
  dateAdded: string;
  userId: string;
};

export type BookImages = {
  mobileImage: string | null;
  mobileImagePreview: string | PreviewPacket | null;
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  mediumImage: string | null;
  mediumImagePreview: string | PreviewPacket | null;
};

export type BookCoversEdits = Partial<
  Pick<Book, "mobileImage" | "mobileImagePreview" | "smallImage" | "smallImagePreview" | "mediumImage" | "mediumImagePreview">
>;

export type BookDisplay = Book & {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
};

type BookSortKeys = "dateAdded" | "title" | "pages";
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
  // this type only has smallImage, but we'll add the other two to avoid unnecessary errors with the BookCover component
  mobileImage: string | null;
  mobileImagePreview: string | PreviewPacket | null;
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  mediumImage: string | null;
  mediumImagePreview: string | PreviewPacket | null;

  asin: string;
};

export type BookDetails = {
  editorialReviews: EditorialReview[];
  similarBooks: SimilarBook[];
};

export type Color = {
  backgroundColor: string;
  order: number;
};

export type UnwrapReadable<T> = T extends Readable<infer U> ? U : never;

export type DynamoUser = {
  pk: string;
  sk: string;
  userId: string;
  isPublic: boolean;
  publicName: string;
  publicBooksHeader: string;
};
