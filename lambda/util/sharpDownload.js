"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharpDownload = void 0;
const node_fetch_1 = require("node-fetch");
const sharpDownload = async (url) => {
    try {
        const result = await (0, node_fetch_1.default)(url);
        const arrayBuffer = await result.arrayBuffer();
        return { body: Buffer.from(arrayBuffer) };
    }
    catch (err) {
        console.log("Error fetching image", err);
        return { error: true, msg: err };
    }
};
exports.sharpDownload = sharpDownload;