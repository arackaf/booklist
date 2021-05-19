"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stickItIn = exports.hello = exports.scanBook = void 0;
var aws_sdk_1 = require("aws-sdk");
var corsResponse_1 = require("../util/corsResponse");
var getDbConnection_1 = require("../util/getDbConnection");
var scanBook = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var db, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log(process.env.stage);
                return [4 /*yield*/, getDbConnection_1.default()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection("pendingEntries").insertOne({ isbn: "Hello World" })];
            case 2:
                _a.sent();
                return [2 /*return*/, corsResponse_1.default({ success: true, x: process.env.stage })];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, corsResponse_1.default({ success: false, error: err_1 })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.scanBook = scanBook;
var hello = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var db, params, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("CALLED YO", +new Date());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                db = new aws_sdk_1.default.DynamoDB({
                    region: "us-east-1"
                });
                params = {
                    TableName: "my_library_scan_state_live",
                    Key: {
                        id: { N: "1" }
                    }
                };
                return [4 /*yield*/, db.getItem(params).promise()];
            case 2:
                result = _a.sent();
                console.log("FOUND", result.Item);
                console.log("FOUND", JSON.stringify(result.Item));
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log("ERROR :(", err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Go Serverless v1.0! Your function executed successfully!",
                        input: event
                    }, null, 2)
                }];
        }
    });
}); };
exports.hello = hello;
var stickItIn = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var db, params, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("CALLED YO", +new Date());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                db = new aws_sdk_1.default.DynamoDB({
                    region: "us-east-1"
                });
                params = {
                    TableName: "my_library_scan_state_live",
                    Item: {
                        id: { N: "1" },
                        items: { L: [{ S: "a" }, { S: "xyzabc" }] }
                    },
                    ConditionExpression: "id <> :idKeyVal",
                    ExpressionAttributeValues: {
                        ":idKeyVal": { N: "1" }
                    }
                };
                return [4 /*yield*/, db.putItem(params).promise()];
            case 2:
                _a.sent();
                console.log("INSERTED");
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log("ERROR :(", err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Go Serverless v1.0! Your function executed successfully!",
                        input: event
                    }, null, 2)
                }];
        }
    });
}); };
exports.stickItIn = stickItIn;
//# sourceMappingURL=handler.js.map