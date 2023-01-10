import { queryLabelColors } from "./dbUtils";

export const allLabelColors = async () => {
  console.log("LOADING COLORS");
  return queryLabelColors({
    pipeline: [{ $sort: { order: 1 } }]
  });
};
