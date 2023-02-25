import type { Subject } from "./types";
import { getSubject, querySubjects, runMultiUpdate, type SubjectEditFields, insertObject, runRequest, mySqlConnectionFactory } from "./dbUtils";

export const allSubjects = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  const httpStart = +new Date();

  try {
    const conn = mySqlConnectionFactory.connection();

    const subjectsResp = (await conn.execute(`SELECT *, id as _id FROM subjects WHERE userId = ? ORDER BY name;`, [userId])) as any;
    const subjects = subjectsResp.rows;

    const httpEnd = +new Date();
    console.log("MySQL subjects time", httpEnd - httpStart);

    return subjects;
  } catch (err) {
    console.log("Error reading subjects", err);
  }
};
export const allSubjects__mongo = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  userId = userId || "";
  const httpStart = +new Date();

  return querySubjects({
    pipeline: [{ $match: { userId } }, { $project: { _id: 1, name: 1, path: 1, textColor: 1, backgroundColor: 1 } }, { $sort: { name: 1 } }]
  })
    .then(subjects => {
      const httpEnd = +new Date();

      console.log("HTTP subjects time", httpEnd - httpStart);

      return subjects;
    })
    .catch(err => {
      console.log("Error loading subjects", err);
      return [];
    });
};

export const saveSubject = async (userId: string, _id: string, subject: SubjectEditFields) => {
  const { name, originalParentId, parentId, backgroundColor, textColor } = subject;

  const newPath = await getNewPath(userId, parentId);
  if (_id) {
    return updateSingleSubject(userId, _id, { name, path: newPath, originalParentId, parentId, backgroundColor, textColor });
  } else {
    return insertSingleSubject(userId, { name, path: newPath, backgroundColor, textColor });
  }
};

const insertSingleSubject = async (userId: string, subject: Omit<Subject, "_id">) => {
  return insertObject("subjects", userId, subject);
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

export const deleteSubject = async (userId: string, _id: string) => {
  const subjectsToDelete = await querySubjects({
    pipeline: [
      {
        $match: {
          userId,
          $or: [{ _id: { $oid: _id } }, { path: { $regex: `.*,${_id},` } }]
        }
      },
      { $project: { _id: 1, name: 1 } }
    ]
  });

  const subjectIds = subjectsToDelete.map(s => s._id);

  await runMultiUpdate(
    "books",
    userId,
    {
      subjects: { $in: subjectIds }
    },
    { $pull: { subjects: { $in: subjectIds } } }
  );

  await runRequest("deleteMany", "subjects", {
    filter: {
      userId,
      $or: [{ _id: { $oid: _id } }, { path: { $regex: `.*,${_id},` } }]
    }
  });
};

const getNewPath = async (userId: string, parentId: string | null): Promise<string | null> => {
  let newParent = parentId ? await getSubject(parentId, userId) : null;

  if (!newParent) {
    return null;
  }

  return `${newParent.path || ","}${newParent._id},`;
};
