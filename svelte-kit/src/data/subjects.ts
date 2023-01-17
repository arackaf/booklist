import { deleteSingleSubject, getSubject, querySubjects, updateSingleSubject, type SubjectEditFields } from "./dbUtils";

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

export const updateSubject = async (userId: string, _id: string, subject: SubjectEditFields) => {
  const { name, originalParentId, parentId, backgroundColor, path, textColor } = subject;

  const newPath = await getNewPath(userId, parentId);
  return updateSingleSubject(userId, _id, { name, path: newPath, originalParentId, parentId, backgroundColor, textColor });
};

export const deleteSubject = async (userId: string, _id: string) => {
  return deleteSingleSubject(userId, _id);
};

const getNewPath = async (userId: string, parentId: string | null): Promise<string | null> => {
  let newParent = parentId ? await getSubject(parentId, userId) : null;

  if (!newParent) {
    return null;
  }

  return `${newParent.path || ","}${newParent._id},`;
};
