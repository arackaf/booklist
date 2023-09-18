export type Label = {
  name: string;
  textColor: string | null;
  backgroundColor: string | null;
};

export type LabelColors = { backgroundColor: string | null; textColor: string | null };

export type HierarchicalLabel = Label & {
  childLevel: number;
  prepend: Label[];
  disabled: boolean;
};
