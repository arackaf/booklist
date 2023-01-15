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
  const { _id, name, parentId, backgroundColor, path, textColor } = subject;

  console.log({ _id, name, parentId, backgroundColor, path, textColor });

  const newPath = await getNewPath(userId, parentId);
  return updateSingleSubject(userId, _id, { name, path: newPath, backgroundColor, textColor });
};

const getNewPath = async (userId: string, parentId: string): Promise<string | null> => {
  let newParent = parentId ? await getSubject(parentId, userId) : null;

  if (!newParent) {
    return null;
  }

  return `${newParent.path || ","}${newParent._id},`;
};
