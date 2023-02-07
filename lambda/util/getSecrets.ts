import { SecretsManager } from "@aws-sdk/client-secrets-manager";

const region = "us-east-1";
const secretName = "MyLibrary";

const secretsClient = new SecretsManager({
  region
});

export const getSecrets = async () => {
  try {
    const result = await secretsClient.getSecretValue({ SecretId: secretName });
    return JSON.parse(result.SecretString);
  } catch (er) {
    console.log("Error reading secrets", er);
    throw er;
  }
};
