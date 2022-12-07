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
};
