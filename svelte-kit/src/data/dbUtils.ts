import { env } from "$env/dynamic/private";

export const runSingleUpdate = runRequest.bind(null, "updateOne");
export const runMultiUpdate = runRequest.bind(null, "updateMany");
export const runAggregate = runRequest.bind(null, "aggregate");

export function runRequest(action: string, collection: string, body: object) {
  return fetch(`${env.MONGO_URL}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": env.MONGO_URL_API_KEY
    },
    body: JSON.stringify({
      collection,
      database: "my-library",
      dataSource: "Cluster0",
      ...body
    })
  })
    .then(res => res.json())
    .catch(err => {
      // TODO
      console.log({ err });
    });
}
