export type Subject = {
  _id: string;
  name: string;
  textColor: string;
  backgroundColor: string;
  path: string;
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

export type PreviewPacket = { w: number; h: number; b64: string };

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
};

export type BookDisplay = Book & {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
};
