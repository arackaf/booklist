"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCover = exports.QUALITIES = exports.SIZE_WIDTHS = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
const sharpDownload_1 = require("./sharpDownload");
const uploadToS3_1 = require("../../util/uploadToS3");
exports.SIZE_WIDTHS = {
    mobile: 35,
    small: 50,
    medium: 106
};
exports.QUALITIES = {
    mobile: 80,
    small: 80,
    medium: 90
};
async function processCover(url, userId) {
    const result = await (0, sharpDownload_1.sharpDownload)(url);
    if (result.error) {
        console.log("Could not download image");
        return null;
    }
    const body = result.body;
    const extension = path_1.default.extname(url) || ".jpg";
    const img = (0, sharp_1.default)(body);
    const metadata = await img.metadata();
    const uploadPath = `aaa/${userId}/${(0, uuid_1.v4)()}${extension}`;
    console.log("Width of image", metadata.width);
    if (metadata.width >= exports.SIZE_WIDTHS.medium) {
        console.log("Processing size medium ...");
        return uploadAndGeneratePreviews(img.resize(exports.SIZE_WIDTHS.medium).jpeg({ quality: 95 }), uploadPath, "medium", "small", "mobile");
    }
    else if (metadata.width >= exports.SIZE_WIDTHS.small) {
        console.log("Processing size small ...");
        return uploadAndGeneratePreviews(img.resize(exports.SIZE_WIDTHS.small).jpeg({ quality: 95 }), uploadPath, "small", "mobile");
    }
    else if (metadata.width >= exports.SIZE_WIDTHS.mobile) {
        console.log("Processing size mobile ...");
        return uploadAndGeneratePreviews(img.resize(exports.SIZE_WIDTHS.mobile).jpeg({ quality: 95 }), uploadPath, "mobile");
    }
    return null;
}
exports.processCover = processCover;
async function uploadAndGeneratePreviews(sharpImage, uploadPath, ...sizes) {
    try {
        const buffer = await sharpImage.toBuffer();
        const metadata = await sharpImage.metadata();
        const s3Result = await (0, uploadToS3_1.uploadToS3)(uploadPath, buffer);
        if (!s3Result.success) {
            console.log("Upload to S3 failed");
            return null;
        }
        console.log("Image upload to S3 succeeded");
    }
    catch (er) {
        console.log("Error sizing and previewing", er);
    }
}
async function generatePreview(sharpImage, uploadPath, size) { }
