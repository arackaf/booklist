require("dotenv").config();
const { syncNextBook } = require("./build/sync-similar-books/index");

syncNextBook();
