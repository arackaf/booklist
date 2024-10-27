import { and, eq, exists, like, or, sql } from "drizzle-orm";
import { booksSubjects, subjects } from "./drizzle-schema";
import { type SubjectEditFields, executeDrizzle, db } from "./dbUtils";
import type { Subject } from "./types";

export const allSubjects = async (userId: string = ""): Promise<Subject[]> => {
  if (!userId) {
    return [];
  }

  try {
    return await executeDrizzle("read subjects", db.select().from(subjects).where(eq(subjects.userId, userId)));
  } catch (err) {
    console.log("Error reading subjects", err);
    return [];
  }
};

export const saveSubject = async (userId: string, id: string, subject: SubjectEditFields) => {
  const { name, originalParentId, parentId, backgroundColor, textColor } = subject;

  const originalParentIdToPass = originalParentId && originalParentId != "0" ? parseInt(originalParentId, 10) : null;

  const newPath = await getNewPath(userId, parentId);
  if (id) {
    return updateSingleSubject(userId, parseInt(id), {
      name,
      path: newPath,
      originalParentId: originalParentIdToPass,
      parentId,
      backgroundColor,
      textColor
    });
  } else {
    return insertSingleSubject(userId, { name, path: newPath, backgroundColor, textColor });
  }
};

const insertSingleSubject = async (userId: string, subject: Omit<Subject, "id">) => {
  await executeDrizzle(
    "insert subject",
    db.insert(subjects).values({
      name: subject.name,
      path: subject.path || null,
      textColor: subject.textColor,
      backgroundColor: subject.backgroundColor,
      userId
    })
  );
};

const updateSingleSubject = async (
  userId: string,
  id: number,
  updates: Omit<SubjectEditFields, "originalParentId"> & { originalParentId: number | null }
) => {
  if (!id) {
    return;
  }

  let newParent: Subject | null = null;
  let newSubjectPath: string | null;
  let newDescendantPathPiece: string | null;

  const parentChanged = updates.originalParentId != updates.parentId;

  if (parentChanged) {
    if (updates.parentId) {
      newParent = await getSubject(updates.parentId, userId);
      if (!newParent) {
        return null;
      }
    }

    newSubjectPath = newParent ? (newParent.path || ",") + `${newParent.id},` : null;
    newDescendantPathPiece = `${newSubjectPath || ","}${id},`;

    await executeDrizzle(
      "update subject - with parent change",
      db.transaction(async tx => {
        await tx
          .update(subjects)
          .set({
            name: updates.name,
            textColor: updates.textColor,
            backgroundColor: updates.backgroundColor,
            path: newSubjectPath
          })
          .where(eq(subjects.id, id));

        await tx
          .update(subjects)
          .set({ path: sql.raw(`REGEXP_REPLACE(path, '(.*,${id},)(.*)', '${newDescendantPathPiece}\\2')`) })
          .where(like(subjects.path, `%,${id},%`));
      })
    );
  } else {
    await executeDrizzle(
      "update subject - no parent change",
      db
        .update(subjects)
        .set({ name: updates.name, textColor: updates.textColor, backgroundColor: updates.backgroundColor })
        .where(eq(subjects.id, id))
    );
  }
};

export const deleteSubject = async (userId: string, id: number) => {
  await executeDrizzle(
    "delete subject",
    db.transaction(async tx => {
      await tx.delete(booksSubjects).where(
        exists(
          db
            .select({ _: sql`'1'` })
            .from(subjects)
            .where(
              and(eq(subjects.id, booksSubjects.subject), eq(subjects.userId, userId), or(eq(subjects.id, id), like(subjects.path, `%,${id},%`)))
            )
        )
      );

      await tx.delete(subjects).where(
        and(
          // check userId
          eq(subjects.userId, userId),
          // subject match, or children
          or(eq(subjects.id, id), like(subjects.path, `%,${id},%`))
        )
      );
    })
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
  const res = await executeDrizzle(
    "get subject",
    db
      .select()
      .from(subjects)
      .where(and(eq(subjects.id, id), eq(subjects.userId, userId)))
  );

  return res[0];
};
