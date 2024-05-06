require("dotenv").config();
const { localSync } = require("./build/sync-similar-books/index");

localSync();
