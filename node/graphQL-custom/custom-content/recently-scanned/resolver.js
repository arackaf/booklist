import { db, getQueryPacket } from "../../../dataAccess/dynamoHelpers";

const getScanResultPk = userId => `User#${userId}#ScanResult`;

export default {
  Query: {
    async recentScanResults(root, args, context, ast) {
      const userId = context.user.id;
      const pk = getScanResultPk(userId);

      const { items, lastEvaluatedKey } = await db.pagedQuery(
        getQueryPacket(`pk = :pk`, {
          ExpressionAttributeValues: { ":pk": pk },
          ExclusiveStartKey: args.exclusiveStartKey || null,
          Limit: 10
        })
      );

      return { ScanResults: items, LastEvaluatedKey: lastEvaluatedKey };
    }
  }
};
