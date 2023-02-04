"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const processCover_1 = require("./util/processCover");
const handler = async (event) => {
    const { url, userId } = event;
    console.log("Processing", { url, userId });
    const result = await (0, processCover_1.processCover)(url, userId);
    return result;
};
exports.handler = handler;
