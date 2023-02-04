"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3MetaData_1 = require("./s3MetaData");
const Bucket = "my-library-cover-uploads";
const uploadToS3 = (fileName, body) => {
    const s3 = new client_s3_1.S3Client({ region: "us-east-1" });
    const key = fileName;
    var params = new client_s3_1.PutObjectCommand(Object.assign({ Bucket, Key: key, Body: body }, s3MetaData_1.defaultMetaData));
    return new Promise(res => {
        s3.send(params, function (err, data) {
            if (err) {
                return res({ success: false, message: err });
            }
            res({ success: true, url: `https://${Bucket}.s3.amazonaws.com/${key}` });
        });
    });
};
exports.uploadToS3 = uploadToS3;
