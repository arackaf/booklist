"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.dynamo = exports.getDeletePacket = exports.getUpdatePacket = exports.getPutPacket = exports.getQueryPacket = exports.getGetPacket = exports.TABLE_NAME = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.TABLE_NAME = `My_Library_${process.env.STAGE}`;
const getGetPacket = (pk, sk, rest = {}) => (Object.assign({ TableName: exports.TABLE_NAME, Key: { pk, sk } }, rest));
exports.getGetPacket = getGetPacket;
const getQueryPacket = (keyExpression, rest = {}) => (Object.assign({ TableName: exports.TABLE_NAME, KeyConditionExpression: keyExpression }, rest));
exports.getQueryPacket = getQueryPacket;
const getPutPacket = (obj, rest = {}) => (Object.assign({ TableName: exports.TABLE_NAME, Item: obj }, rest));
exports.getPutPacket = getPutPacket;
const getUpdatePacket = (pk, sk, rest) => (Object.assign({ TableName: exports.TABLE_NAME, Key: { pk, sk } }, rest));
exports.getUpdatePacket = getUpdatePacket;
const getDeletePacket = (key) => ({ TableName: exports.TABLE_NAME, Key: key });
exports.getDeletePacket = getDeletePacket;
const dynamoConfig = {
    region: "us-east-1"
};
exports.dynamo = lib_dynamodb_1.DynamoDBDocument.from(new client_dynamodb_1.DynamoDB(dynamoConfig));
const wait = ms => new Promise(res => setTimeout(res, ms));
exports.db = {
    async put(packet) {
        return exports.dynamo.put(packet);
    },
    async get(packet) {
        let result = await exports.dynamo.get(packet);
        return result.Item || null;
    },
    async query(packet) {
        let res = await exports.dynamo.query(packet);
        if (!res || !res.Items) {
            return [];
        }
        return res.Items;
    },
    async queryOne(packet) {
        let res = await exports.dynamo.query(packet);
        if (!res || !res.Items || !res.Items[0]) {
            return null;
        }
        return res.Items[0];
    },
    async update(packet) {
        return exports.dynamo.update(packet);
    },
    async transactWrite(packet, attempts = 5) {
        console.log("ATTEMPTING TRANSACTION", JSON.stringify(packet));
        try {
            const result = await attemptExecution(attempts, () => exports.dynamo.transactWrite(packet));
            console.log("TRANSACTION SUCCESS");
        }
        catch (err) {
            console.log("TRANSACTION FAILED", err);
            throw err;
        }
    },
    async deleteItem(pk, sk) {
        return exports.dynamo.delete({ TableName: exports.TABLE_NAME, Key: { pk, sk } });
    }
};
async function attemptExecution(times, executor) {
    let success;
    let resultOrError;
    for (let i = 1; i <= 5; i++) {
        [success, resultOrError] = await attemptRun(executor);
        if (success) {
            return resultOrError;
        }
        console.log("Failed on attempt:", i, resultOrError);
        await wait(150 * i * Math.random());
    }
    throw resultOrError;
}
async function attemptRun(executor) {
    try {
        const result = await executor();
        return [true, result];
    }
    catch (err) {
        return [false, err];
    }
}
