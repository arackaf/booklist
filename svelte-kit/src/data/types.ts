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
  pages: number;
  isbn: string;
  publisher: string;
  publicationDate: string;
  dateAddedDisplay: string;
  isRead: boolean;
  authors: string[];
  tags: string[];
  subjects: string[];
  smallImage: string | null;
  smallImagePreview: string | PreviewPacket | null;
  dateAdded: string;
};

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
  search: string;
  publisher: string;
  author: string;
  tags: string[];
  subjects: string[];
  sort?: BookSortValue;
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
