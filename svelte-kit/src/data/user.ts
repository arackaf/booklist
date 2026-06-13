import { eq } from "drizzle-orm";
import { userInfo } from "./drizzle-schema";
import { type DB } from "./dbUtils";

export async function getUser(db: DB, userId: string) {
  try {
    const start = +new Date();
    const result = await db.select().from(userInfo).where(eq(userInfo.userId, userId));
    const userFound = result[0] ?? null;
    const end = +new Date();

    console.log("Public user lookup time:", end - start, "Found:", userFound == null ? "null" : userFound.userId);

    return userFound;
  } catch (loginErr) {
    console.log("Login error", loginErr);
    return null;
  }
}

export async function createUser(db: DB, userId: string) {
  await db.insert(userInfo).values({ userId, isPublic: false, publicName: "", publicBooksHeader: "" });
}

export async function updateUser(db: DB, userId: string, isPublic: boolean, publicName: string, publicBooksHeader: string) {
  await db.update(userInfo).set({ isPublic, publicName, publicBooksHeader }).where(eq(userInfo.userId, userId));
}
