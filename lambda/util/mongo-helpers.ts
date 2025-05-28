import { IS_DEV } from "./environment";
import { getSecrets } from "./getSecrets";

async function getDataApiValues() {
  const secrets = await getSecrets();

  const url = secrets[IS_DEV ? "mongo-url-dev" : "mongo-url-live"];
  const apiKey = secrets[IS_DEV ? "mongo-api-key-dev" : "mongo-api-key-live"];

  return { url, apiKey };
}

export async function runRequest(action: string, collection: string, body: object) {
  const { apiKey, url } = await getDataApiValues();

  return fetch(`${url}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": apiKey
    },
    body: JSON.stringify({
      collection,
      database: "my-library",
      dataSource: "ServerlessInstance0",
      ...body
    })
  })
    .then(res => res.json())
    .catch(err => {
      // TODO
      console.log({ err });
    });
}
