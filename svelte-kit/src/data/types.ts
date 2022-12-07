export type Subject = {
  _id: string;
  name: string;
  path: string;
};

export type DisablableSubject = Subject & {
  disabled: boolean;
};

export type FullSubject = Subject & {
  children: FullSubject[];
  childLevel: number;
};

export type SubjectHash = {
  [_id: string]: FullSubject;
};

export type Tag = {
  _id: string;
  name: string;
};

export type TagHash = {
  [_id: string]: Tag;
};
