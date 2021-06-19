import AWS from "aws-sdk";

export const makeGetGetPacket = TABLE_NAME => (pk, sk, rest = {}) => ({ TableName: TABLE_NAME, Key: { pk, sk }, ...rest });
export const makeGetQueryPacket = TABLE_NAME => (keyExpression, rest = {}) => ({
  TableName: TABLE_NAME,
  KeyConditionExpression: keyExpression,
  ...rest
});
export const makeGetPutPacket = TABLE_NAME => (obj, rest = {}) => ({ TableName: TABLE_NAME, Item: obj, ...rest });

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});

export const db = {
  async put(packet) {
    await dynamo.put(packet).promise();
  },

  async get(packet) {
    let result = await dynamo.get(packet).promise();
    return result.Item || null;
  },

  async queryOne(packet) {
    let res = await dynamo.query(packet).promise();

    if (!res || !res.Items || !res.Items[0]) {
      return null;
    }

    return res.Items[0];
  },

  async update(packet) {
    await dynamo.update(packet).promise();
  },

  async transactWrite(packet) {
    await dynamo.transactWrite(packet).promise();
  }
};
