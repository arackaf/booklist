export default obj => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  },
  body: JSON.stringify(obj)
});

export const rawResponse = ({ headers = {}, multiValueHeaders = {}, success = true, ...rest } = {} as any) => ({
  statusCode: success ? 200 : 500,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    ...headers
  },
  multiValueHeaders,
  body: JSON.stringify(rest)
});
