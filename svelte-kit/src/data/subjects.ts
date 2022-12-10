import { getDbConnection } from "./dbUtils";
import type { Subject } from "./types";

const { db } = await getDbConnection();

export const allSubjects = async () => {
  const nativeStart = +new Date();

  const result: Subject[] = (await db
    .collection("subjects")
    .aggregate([
      { $match: { userId: "60a93babcc3928454b5d1cc6" } },
      { $project: { _id: 1, name: 1, path: 1, textColor: 1, backgroundColor: 1 } },
      { $sort: { name: 1 } }
    ])
    .toArray()) as Subject[];

  const nativeEnd = +new Date();

  console.log("Native time subjects", nativeEnd - nativeStart);
  const allSubjectsSorted: Subject[] = result.map(s => ({ ...s, _id: s._id.toString() }));

  return allSubjectsSorted;
};
