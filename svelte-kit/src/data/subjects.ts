import type { Subject } from "./types";
import { type SubjectEditFields, mySqlConnectionFactory, runTransaction } from "./dbUtils";

export const allSubjects = async (userId: string = "") => {
  if (!userId) {
    return [];
  }

  const httpStart = +new Date();

  try {
    const conn = mySqlConnectionFactory.connection();

    const subjectsResp = (await conn.execute(`SELECT * FROM subjects WHERE userId = ? ORDER BY name;`, [userId])) as any;
    const subjects = subjectsResp.rows;

    const httpEnd = +new Date();
    console.log("MySQL subjects time", httpEnd - httpStart);

    return subjects;
  } catch (err) {
    console.log("Error reading subjects", err);
  }
};

export const saveSubject = async (userId: string, id: string, subject: SubjectEditFields) => {
  const { name, originalParentId, parentId, backgroundColor, textColor } = subject;

  const newPath = await getNewPath(userId, parentId);
  if (id) {
    return updateSingleSubject(userId, parseInt(id), { name, path: newPath, originalParentId, parentId, backgroundColor, textColor });
  } else {
    return insertSingleSubject(userId, { name, path: newPath, backgroundColor, textColor });
  }
};

const insertSingleSubject = async (userId: string, subject: Omit<Subject, "id">) => {
  const conn = mySqlConnectionFactory.connection();
  console.log({ newSubject: subject });
  await conn.execute(`INSERT INTO subjects (name, path, textColor, backgroundColor, userId) VALUES (?, ?, ?, ?, ?)`, [
    subject.name,
    subject.path || null,
    subject.textColor,
    subject.backgroundColor,
    userId
  ]);
};

const updateSingleSubject = async (userId: string, id: number, updates: SubjectEditFields) => {
  if (!id) {
    return;
  }

  let newParent: Subject | null = null;
  let newSubjectPath: string | null;
  let newDescendantPathPiece: string | null;

  const conn = mySqlConnectionFactory.connection();

  const parentChanged = updates.originalParentId !== updates.parentId;
  if (parentChanged) {
    if (updates.parentId) {
      newParent = await getSubject(updates.parentId!, userId);
      if (!newParent) {
        return null;
      }
    }

    newSubjectPath = newParent ? (newParent.path || ",") + `${newParent.id},` : null;
    newDescendantPathPiece = `${newSubjectPath || ","}${id},`;

    await runTransaction(
      "update subject",
      tx =>
        tx.execute(
          `
        UPDATE subjects
        SET name = ?, textColor = ?, backgroundColor = ?, path = ?
        WHERE id = ?
        `,
          [updates.name, updates.textColor, updates.backgroundColor, newSubjectPath, id]
        ),
      tx =>
        tx.execute(
          `
        UPDATE subjects
        SET path = REGEXP_REPLACE(path, '(.*,${id},)(.*)', '${newDescendantPathPiece}$2')
        WHERE path LIKE '%,${id},%'
      `,
          []
        )
    );
    return;
  } else {
    await conn.execute(
      `
        UPDATE subjects
        SET name = ?, textColor = ?, backgroundColor = ?
        WHERE id = ?
    `,
      [updates.name, updates.textColor, updates.backgroundColor, id]
    );

    return;
  }
};

export const deleteSubject = async (userId: string, id: number) => {
  await runTransaction(
    "delete subject",
    tx =>
      tx.execute(
        `
        DELETE
        FROM books_subjects bs
        WHERE bs.subject IN (
          SELECT id
          FROM subjects s
          WHERE userId = ? AND (id = ? OR PATH LIKE '%,?,%')
      )
    `,
        [userId, id, id]
      ),
    tx =>
      tx.execute(
        `
        DELETE FROM subjects
        WHERE userId = ? AND (id = ? OR PATH LIKE '%,?,%')
      `,
        [userId, id, id]
      )
  );
};

const getNewPath = async (userId: string, parentId: number | null): Promise<string | null> => {
  let newParent = parentId ? await getSubject(parentId, userId) : null;

  if (!newParent) {
    return null;
  }

  return `${newParent.path || ","}${newParent.id},`;
};

const getSubject = async (id: number, userId: string): Promise<Subject> => {
  const conn = mySqlConnectionFactory.connection();
  const res = await conn.execute("SELECT * FROM subjects WHERE id = ? AND userId = ?", [id, userId]);
  return res.rows[0] as Subject;
};
