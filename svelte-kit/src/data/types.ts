export type Subject = {
  _id: string;
  name: string;
  path: string;
};

export type SubjectWithPrepends = Subject & {
  prepend: Subject[];
};

export type FullSubject = Subject & {
  children: FullSubject[];
  childLevel: number;
};

export type SubjectHash = {
  [_id: string]: Subject;
};

export type Tag = {
  _id: string;
  name: string;
};

export type TagHash = {
  [_id: string]: Tag;
};
