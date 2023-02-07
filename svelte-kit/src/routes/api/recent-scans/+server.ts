import { db, getQueryPacket } from "$data/dynamoHelpers";
import { json } from "@sveltejs/kit";

const getScanResultPk = (userId: string) => `User#${userId}#ScanResult`;

export async function GET({ url, locals }: { url: URL; locals: any }) {
  const session = await locals.getSession();
  if (!session) {
    return json({});
  }

  const userId = session.userId;
  const lastPageKey = url.searchParams.get("next-page-key") || "";

  const pk = getScanResultPk(userId);
  const pageKey = lastPageKey
    ? {
        pk,
        sk: lastPageKey
      }
    : null;

  const results = await db.pagedQuery(
    getQueryPacket(`pk = :pk`, {
      ExpressionAttributeValues: { ":pk": pk },
      ExclusiveStartKey: pageKey ?? void 0,
      Limit: 10
    })
  );

  const scans: any[] = results?.items ?? [];
  const nextPageKey: string = results?.lastEvaluatedKey?.sk ?? "";

  return json({ scans, nextPageKey });
}
