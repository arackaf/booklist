import { queryLabelColors } from "./dbUtils";

export const allLabelColors = async () => {
  const start = +new Date();
  return queryLabelColors({
    pipeline: [{ $sort: { order: 1 } }]
  }).then(results => {
    const end = +new Date();
    console.log("HTTP colors time", end - start);

    return results;
  });
};
