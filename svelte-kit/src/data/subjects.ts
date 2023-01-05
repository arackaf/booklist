import { querySubjects } from "./dbUtils";

export const allSubjects = async (userId: string) => {
  userId = userId || "";
  const httpStart = +new Date();

  return querySubjects({
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, path: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  }).then(subjects => {
    const httpEnd = +new Date();

    console.log("Http time subjects", httpEnd - httpStart);
    return subjects;
  });
};
