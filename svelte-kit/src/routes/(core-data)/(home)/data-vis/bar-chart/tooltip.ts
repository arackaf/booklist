import type { Subject } from "$data/types";

export type Position = "absolute-left" | "absolute-right" | "top" | "top-left" | "top-right" | "right-start" | "left-start";

export type PopperOptions = {
  position: Position;
  data: Data;
  drilldown: any;
  remove: (id: string) => void;
  hoverTarget?: Element;
  onShow?: () => void;
  onHide?: () => void;
};

export type Data = {
  groupId: string;
  count: number;
  display: string;
  childSubjects: Subject[];
  entries: { name: string; color: string }[];
};
