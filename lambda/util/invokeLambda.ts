import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { toUtf8, fromUtf8 } from "@aws-sdk/util-utf8-node";

export const invoke = async (name: string, payload: object) => {
  const client = new LambdaClient({
    region: "us-east-1"
  });
  const command = new InvokeCommand({
    FunctionName: name,
    Payload: fromUtf8(JSON.stringify(payload))
  });
  const response = await client.send(command);

  return response;
};
