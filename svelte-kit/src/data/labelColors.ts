import { queryLabelColors } from "./dbUtils";

export const allLabelColors = async () => {
  return queryLabelColors({
    pipeline: [{ $sort: { order: 1 } }]
  });
};
