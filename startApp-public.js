import express from "express";
const app = express();
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import fs from "fs";
import mkdirp from "mkdirp";
import compression from "compression";

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

import multer from "multer";

import { easyControllers } from "easy-express-controllers";
import expressWsImport from "express-ws";

import { getPublicGraphqlSchema, getGraphqlSchema } from "./node/util/graphqlUtils";

import uuid from "uuid/v4";
import { resizeIfNeeded, saveCoverToS3, removeFile } from "./node/util/bookCovers/bookCoverHelpers";

app.use(compression());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(cookieParser());
app.use(session({ secret: "adam_booklist", saveUninitialized: true, resave: true }));

const expressWs = expressWsImport(app);

app.use("/static/", express.static(__dirname + "/static/"));
app.use("/node_modules/", express.static(__dirname + "/node_modules/"));
app.use("/react/", express.static(__dirname + "/react/"));
app.use("/utils/", express.static(__dirname + "/utils/"));
app.use("/uploads/", express.static(__dirname + "/uploads/"));

app.ws("/bookEntryWS", function(ws, req) {
  bookEntryQueueManager.subscriberAdded(req.user.id, ws);
});

app.use("/compare/react/", express.static(__dirname + "/compare/react/"));
app.get("/compare/react", (req, res) => {
  res.sendFile(path.join(__dirname + "/compare/react/dist/index.html"));
});

app.get("/favicon.ico", function(request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

const multerBookCoverUploadStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (!req.user.id) {
      cb("Not logged in");
    } else {
      let path = `./uploads/${req.user.id}/coverUpload`;

      fs.stat(path, function(err) {
        if (err) {
          mkdirp(path, (err, res) => cb(err, path));
        } else {
          cb(null, path);
        }
      });
    }
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: multerBookCoverUploadStorage });

app.post("/react/upload-small-cover", upload.single("fileUploaded"), async function(req, response) {
  coverUpload(req, response);
});

app.post("/react/upload-medium-cover", upload.single("fileUploaded"), async function(req, response) {
  coverUpload(req, response, { maxWidth: 106 });
});

async function coverUpload(req, response, { maxWidth } = {}) {
  if (req.file.size > 900000) {
    return response.send({ success: false, error: "Max size is 500K" });
  }

  mkdirp.sync(path.resolve("./conversions"));

  let ext = path.extname(req.file.originalname);
  let newFileName = `${uuid()}${ext}`;
  fs.copyFileSync(path.join(req.file.destination, req.file.filename), path.resolve(`./conversions/${newFileName}`));

  let resizedFile = await resizeIfNeeded(newFileName, maxWidth);
  if (!resizedFile) {
    return response.send({ success: false, error: "Could not read image" });
  }
  let s3path = await saveCoverToS3(resizedFile, `bookCovers/${req.user.id}/${newFileName}`);
  if (!s3path) {
    return response.send({ success: false, error: "Error saving image" });
  }
  removeFile(path.resolve(`./conversions/${newFileName}`));
  removeFile(resizedFile);
  removeFile(path.join(req.file.destination, req.file.filename));

  response.send({ success: true, url: s3path });
}

process.on("uncaughtException", error);
process.on("unhandledRejection", error);
process.on("exit", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  process.exit();
}

function error(err) {
  try {
    console.log(err);
  } catch (e) {}
}

app.listen(process.env.PORT || 3000);

export default null;
