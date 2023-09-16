import type { Readable } from "svelte/store";

export type Label = {
  id: number;
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

export type BookSubjectStack = { subjects: number[]; count: number };

export type BookImages = {
  mobileImage: string | null;
  mobileImagePreview: string | PreviewPacket | null;
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  mediumImage: string | null;
  mediumImagePreview: string | PreviewPacket | null;
};

export type Book = {
  id: number;
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
  dateAdded: string;
  userId: string;
  editorialReviews: any;
} & BookImages;

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
  publicUser?: string;
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

export type MinimalBookInfo = {
  title: string;
  isbn: string;
  authors: string[];
} & BookImages;

export type SimilarBook = {
  title: string;
  isbn: string;
  authors: string[];
} & BookImages;

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

export type BookWithSimilarItems = {
  id: number;
  title: string;
  isbn: string;
  authors: string[];
  similarBooks: string[] | null;
  similarBooksLastSync: string;
  similarBooksLastSyncDisplay: string;
} & BookImages;
