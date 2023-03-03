import { Client } from "@planetscale/database";

import { getSecrets } from "./getSecrets";
import { IS_DEV } from "./environment";

export const getConnection = async () => {
  const secrets = await getSecrets();

  const connectionString = secrets[IS_DEV ? "mysql-connection-dev" : "mysql-connection-live"];

  const mySqlConnectionFactory = new Client({
    url: connectionString
  });

  return mySqlConnectionFactory.connection();
};
