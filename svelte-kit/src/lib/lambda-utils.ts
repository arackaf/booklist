import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8";

import { env } from "$env/dynamic/private";
const { AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY } = env;

export const invokeLambda = async <T = any>(lambda: string, payload: any): Promise<T> => {
  const client = new LambdaClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: AMAZON_ACCESS_KEY,
      secretAccessKey: AMAZON_SECRET_KEY
    }
  });
  const command = new InvokeCommand({
    FunctionName: lambda,
    Payload: fromUtf8(JSON.stringify(payload))
  });
  const response = await client.send(command);

  if (response.Payload) {
    const respJson = JSON.parse(toUtf8(response.Payload));

    return respJson;
  } else {
    throw { error: true };
  }
};
