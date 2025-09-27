import { DynamoDB, DynamoDBClientConfig, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { ENV } from "./config/env";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamoConfig: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: ENV.AMAZON_ACCESS_KEY!,
    secretAccessKey: ENV.AMAZON_SECRET_KEY!
  },

  region: "us-east-1"
};

export const dynamo = DynamoDBDocument.from(new DynamoDB(dynamoConfig));

const getUserAliasKey = (userId: string) => `UserAlias#${userId}`;

export async function getUserSync(userId: string): Promise<string | null> {
  try {
    const syncEntry = await dynamo.scan({
      TableName: ENV.DYNAMO_TABLE!,
      FilterExpression: "pk = :key"
    });
  } catch (er) {
    console.log("Error getting user sync", er);
    return null;
  }
}
