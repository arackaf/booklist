export type Tag = {
  _id: string;
  name: string;
};

export type TagHash = {
  [_id: string]: Tag;
};
