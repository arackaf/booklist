import { IS_DEV } from "./environment";
import { getSecrets } from "./getSecrets";

export async function getDbConnection() {
  const secrets = await getSecrets();

  const url = secrets[IS_DEV ? "mongo-url-dev" : "mongo-url-live"];
  const apiKey = secrets[IS_DEV ? "mongo-api-key-dev" : "mongo-api-key-live"];

  return { url, apiKey };
}
