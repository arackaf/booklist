"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveContentToS3 = exports.getGoogleLibraryUri = exports.getOpenLibraryCoverUri = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3MetaData_1 = require("./s3MetaData");
const GOOGLE_LIBRARY_KEY = process.env.GOOGLE_LIBRARY_KEY;
const getOpenLibraryCoverUri = isbn => `http://covers.openlibrary.org/b/ISBN/${isbn}-M.jpg`;
exports.getOpenLibraryCoverUri = getOpenLibraryCoverUri;
const getGoogleLibraryUri = (isbn, GOOGLE_LIBRARY_KEY) => `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_LIBRARY_KEY}`;
exports.getGoogleLibraryUri = getGoogleLibraryUri;
function saveContentToS3(content, s3Key) {
    return new Promise(res => {
        let s3bucket = new client_s3_1.S3Client({ region: "us-east-1" });
        let params = new client_s3_1.PutObjectCommand(Object.assign({ Bucket: "my-library-cover-uploads", Key: s3Key, Body: content }, s3MetaData_1.defaultMetaData));
        s3bucket.send(params, function (err) {
            if (err) {
                console.log("Error uploading to S3", { s3Key, err });
                res(err);
            }
            else {
                console.log("S3 File Saved");
                // @ts-ignore
                res(`https://my-library-cover-uploads.s3.amazonaws.com/${params.Key}`);
            }
        });
    });
}
exports.saveContentToS3 = saveContentToS3;
