import { runAggregate } from "./dbUtils";

export const allSubjects = async (userId: string) => {
  userId = userId || "";
  const httpStart = +new Date();

  return runAggregate("subjects", {
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, path: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  }).then(res => {
    const httpEnd = +new Date();

    console.log("Http time subjects", httpEnd - httpStart);
    return res.documents;
  });
};
