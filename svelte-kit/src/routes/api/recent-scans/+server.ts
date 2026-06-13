import { json } from "@sveltejs/kit";

import { bookScans } from "$data/drizzle-schema";
import { and, desc, eq, or } from "drizzle-orm";

export async function GET({ url, locals }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }
  const db = locals.db;

  const userId = session.userId;
  let offset = parseInt(url.searchParams.get("offset") || "0", 10);
  if (isNaN(offset)) {
    offset = 0;
  }

  const scans = await db
    .select()
    .from(bookScans)
    .where(and(eq(bookScans.userId, userId), or(eq(bookScans.status, "SUCCESS"), eq(bookScans.status, "FAILURE"))))
    .orderBy(desc(bookScans.id))
    .limit(10)
    .offset(offset);

  return json({ scans, nextOffset: offset + 10 });
}
