import { Client } from "@planetscale/database";

import { getSecrets } from "./getSecrets";
import { IS_DEV } from "./environment";

export const getConnection = async () => {
  const secrets = await getSecrets();

  const connectionString = secrets["mysql-connection"];

  const mySqlConnectionFactory = new Client({
    url: connectionString
  });

  return mySqlConnectionFactory.connection();
};
