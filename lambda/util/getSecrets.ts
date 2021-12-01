import { SecretsManager } from "aws-sdk";

const region = "us-east-1";
const secretName = "MyLibrary";

const secretsClient = new SecretsManager({
  region
});

export default () =>
  secretsClient
    .getSecretValue({ SecretId: secretName })
    .promise()
    .then(c => JSON.parse(c.SecretString));
