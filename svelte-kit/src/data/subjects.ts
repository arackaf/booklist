import type { Subject } from "./types";
import { getSubject, querySubjects, runMultiUpdate, deleteById, type SubjectEditFields } from "./dbUtils";

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

export const saveSubject = async (userId: string, _id: string, subject: SubjectEditFields) => {
  const { name, originalParentId, parentId, backgroundColor, path, textColor } = subject;

  const newPath = await getNewPath(userId, parentId);
  return updateSingleSubject(userId, _id, { name, path: newPath, originalParentId, parentId, backgroundColor, textColor });
};

const updateSingleSubject = async (userId: string, _id: string, updates: SubjectEditFields) => {
  let newParent: Subject | null = null;
  let newSubjectPath: string | null;
  let newDescendantPathPiece: string | null;

  const parentChanged = updates.originalParentId !== updates.parentId;

  if (parentChanged) {
    if (updates.parentId) {
      newParent = await getSubject(updates.parentId!, userId);
      if (!newParent) {
        return null;
      }
    }

    newSubjectPath = newParent ? (newParent.path || ",") + `${newParent._id},` : null;
    newDescendantPathPiece = `${newSubjectPath || ","}${_id},`;
  }

  const conditions: object[] = [{ _id: { $oid: _id } }];
  if (parentChanged) {
    conditions.push({
      path: { $regex: `.*,${_id},` }
    });
  }

  const changeOnOriginal = (field: string, value: any, altValue?: any) => {
    return {
      [field]: {
        $cond: {
          if: { $eq: ["$_id", { $oid: _id }] },
          then: value,
          else: altValue === void 0 ? `$${field}` : altValue
        }
      }
    };
  };

  return runMultiUpdate("subjects", userId, { $or: conditions }, [
    {
      $addFields: {
        pathMatch: {
          $regexFind: {
            input: "$path",
            regex: `.*,${_id},`
          }
        }
      }
    },
    {
      $set: {
        ...changeOnOriginal("name", updates.name),
        ...changeOnOriginal("textColor", updates.textColor),
        ...changeOnOriginal("backgroundColor", updates.backgroundColor),
        ...(parentChanged
          ? changeOnOriginal("path", newSubjectPath!, {
              $replaceAll: { input: "$path", find: "$pathMatch.match", replacement: newDescendantPathPiece! }
            })
          : {})
      }
    },
    {
      $unset: ["pathMatch"]
    }
  ]);
};

export const deleteSingleSubject = deleteById.bind(null, "subjects");

const getNewPath = async (userId: string, parentId: string | null): Promise<string | null> => {
  let newParent = parentId ? await getSubject(parentId, userId) : null;

  if (!newParent) {
    return null;
  }

  return `${newParent.path || ","}${newParent._id},`;
};
