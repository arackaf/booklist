import { getSubject, querySubjects, updateSingleSubject } from "./dbUtils";
import type { Subject } from "./types";

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

export const updateSubject = async (userId: string, subject: Subject & { parentId: string }) => {
  const { _id, name, parentId, backgroundColor, textColor } = subject;

  const temp = await getSubject(_id);

  return updateSingleSubject(userId, { _id: { $oid: _id } }, { $set: { name, parentId, backgroundColor, textColor } });
};
