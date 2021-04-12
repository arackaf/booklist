const AWS = require("aws-sdk");
const region = "us-east-1";
const secretName = "MyLibrary";

const secretsClient = new AWS.SecretsManager({
  region
});

module.exports = () =>
  secretsClient
    .getSecretValue({ SecretId: secretName })
    .promise()
    .then(c => JSON.parse(c.SecretString));
