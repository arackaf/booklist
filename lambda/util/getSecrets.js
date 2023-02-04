"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecrets = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const region = "us-east-1";
const secretName = "MyLibrary";
const secretsClient = new client_secrets_manager_1.SecretsManager({
    region
});
const getSecrets = async () => {
    try {
        const result = await secretsClient.getSecretValue({ SecretId: secretName });
        return JSON.parse(result.SecretString);
    }
    catch (er) {
        console.log("Error reading secrets", er);
        throw er;
    }
};
exports.getSecrets = getSecrets;
