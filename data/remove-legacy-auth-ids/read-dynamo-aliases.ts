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

export async function getUserAliases(): Promise<any> {
  try {
    const allAliases = await dynamo.scan({
      TableName: ENV.DYNAMO_TABLE!,
      FilterExpression: "begins_with(pk, :prefix)",
      ExpressionAttributeValues: {
        ":prefix": "UserAlias#"
      }
    });

    return allAliases.Items;
  } catch (er) {
    console.log("Error getting user sync", er);
    return null;
  }
}
