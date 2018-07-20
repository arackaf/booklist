import dao from "./node-src/dataAccess/dao";
import bookEntryQueueManager from "./node-src/app-helpers/bookEntryQueueManager";
import PendingBookEntryDao from "./node-src/dataAccess/pendingBookEntryDAO";
import ErrorLoggerDao from "./node-src/dataAccess/errorLoggerDAO";
import UserDao from "./node-src/dataAccess/userDAO";

import express from "express";
const app = express();
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import fs from "fs";
import mkdirp from "mkdirp";
import Jimp from "jimp";
import compression from "compression";
import http from "http";

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

import multer from "multer";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as RememberMeStrategy } from "passport-remember-me";

import { easyControllers } from "easy-express-controllers";
import expressWsImport from "express-ws";
import webpush from "web-push";
import { MongoClient } from "mongodb";
import expressGraphql from "express-graphql";

import resolvers from "./node-src/graphQL/resolver";
import schema from "./node-src/graphQL/schema";

import resolversPublic from "./node-src/graphQL-public/resolver";
import schemaPublic from "./node-src/graphQL-public/schema";

import { makeExecutableSchema } from "graphql-tools";
import { middleware } from "generic-persistgraphql";

if (!process.env.IS_DEV) {
  app.use(function ensureSec(request, response, next) {
    let proto = request.header("x-forwarded-proto") || request.header("X-Forwarded-Proto") || request.get("X-Forwarded-Proto"),
      secure = proto == "https";
    if (secure) {
      return next();
    } else {
      response.redirect("https://" + request.headers.host + request.url);
    }
  });
}

// setTimeout(() => {
//   new UserDao().getSubscription("56f34a2748243210269ecd66").then(sub => {
//     try {
//       webpush.setVapidDetails(process.env.PUSH_SUBJECT, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
//       webpush
//         .sendNotification(sub, "hello")
//         .then(() => {
//           console.log("SENT for real");
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     } catch (er) {
//       console.log(er);
//     }
//   });
// }, 5000);

passport.use(
  new LocalStrategy(function(email, password, done) {
    let userDao = new UserDao();

    userDao.lookupUser(email, password).then(userResult => {
      if (userResult) {
        userResult.id = "" + userResult._id;
        done(null, userResult);
      } else {
        done(null, false, { message: "Incorrect login" });
      }
    });
  })
);

function consumeRememberMeToken(token, done) {
  let userDao = new UserDao();

  userDao.lookupUserByToken(token).then(userResult => {
    if (userResult) {
      userResult.id = "" + userResult._id;
      done(null, userResult);
    } else {
      done(null, null);
    }
  });
}

passport.use(
  new RememberMeStrategy(
    function(token, done) {
      consumeRememberMeToken(token, function(err, userResult) {
        if (err) {
          return done(err);
        }
        if (!userResult) {
          return done(null, false);
        }

        done(null, userResult);
      });
    },
    function(user, done) {
      return done(null, user.token);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  return done(undefined, { id: "" + id, _id: "" + id });
});

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
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

const dbPromise = MongoClient.connect(process.env.MONGO_CONNECTION || process.env.MONGOHQ_URL);
const root = { db: dbPromise };
const executableSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

middleware(app, { url: "/graphql", mappingFile: path.resolve(__dirname, "./react-redux/extracted_queries.json") });
app.use(
  "/graphql",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

const dbPromisePublic = MongoClient.connect(process.env.MONGO_CONNECTION || process.env.MONGOHQ_URL);
const rootPublic = { db: dbPromise };
const executableSchemaPublic = makeExecutableSchema({ typeDefs: schemaPublic, resolvers: resolversPublic });

app.use("/graphql-public", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(
  "/graphql-public",
  expressGraphql({
    schema: executableSchemaPublic,
    graphiql: true,
    rootValue: rootPublic
  })
);

const expressWs = expressWsImport(app);

app.use("/static/", express.static(__dirname + "/static/"));
app.use("/node_modules/", express.static(__dirname + "/node_modules/"));
app.use("/react-redux/", express.static(__dirname + "/react-redux/"));
app.use("/utils/", express.static(__dirname + "/utils/"));
app.use("/uploads/", express.static(__dirname + "/uploads/"));

app.ws("/bookEntryWS", function(ws, req) {
  bookEntryQueueManager.subscriberAdded(req.user.id, ws);
});

easyControllers.createAllControllers(app, { fileTest: f => !/-es6.js$/.test(f) }, { __dirname: "./node-src" });

app.get("react-redux/offline.htm", (req, response) => response.sendfile("/react-redux/offline.htm"));
app.get("/", browseToReactRedux);
app.get("/books", browseToReactRedux);
app.get("/login", browseToReactRedux);
app.get("/subjects", browseToReactRedux);
app.get("/settings", browseToReactRedux);
app.get("/scan", browseToReactRedux);
app.get("/home", browseToReactRedux);
app.get("/view", browseToReactRedux);
app.get("/react-redux", browseToReactRedux);
app.get("/service-worker.js", (request, response) => {
  response.sendFile(path.join(__dirname + "/react-redux/dist/service-worker.js"));
});

function browseToReactRedux(request, response) {
  if (!!request.user) {
  } else {
    response.clearCookie("logged_in");
    response.clearCookie("remember_me");
    response.clearCookie("userId");
  }
  response.sendFile(path.join(__dirname + "/react-redux/dist/index.html"));
}

app.get("/favicon.ico", function(request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

app.post("/react-redux/login", passport.authenticate("local"), function(req, response) {
  // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
  let rememberMe = req.body.rememberme == 1;

  response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("userId", req.user.id, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  if (rememberMe) {
    response.cookie("remember_me", req.user.token, { path: "/", httpOnly: true, maxAge: rememberMeExpiration });
  }
  response.send(req.user);
});

app.post("/react-redux/logout", function(req, response) {
  response.clearCookie("logged_in");
  response.clearCookie("remember_me");
  response.clearCookie("userId");
  req.logout();
  response.send({});
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

//TODO: refactor to be a controller action - will require middleware in easy-express-controllers which doesn't currently exist
app.post("/react-redux/upload", upload.single("fileUploaded"), function(req, response) {
  //req.body.___ still has manual fields sent over
  if (req.file.size > 900000) {
    return response.send({ success: false, error: "Max size is 500K" });
  }

  let ext = path.extname(req.file.originalname);
  let newName =
    req.file.originalname
      .replace(new RegExp(ext + "$"), "")
      .replace(/\./g, "")
      .replace(/\+/g, "")
      .replace(/\,/g, "") +
    ("_" + +new Date()) +
    ext;

  let pathResult = path.normalize(req.file.destination).replace(/\\/g, "/");
  let pathToFileUploaded = `${pathResult}/${req.file.originalname}`;

  try {
    Jimp.read(pathToFileUploaded, function(err, image) {
      if (err) {
        return response.send({ success: false, error: "Error opening file. Is it a valid image?" });
      }
      image.exifRotate();

      processImageAsNeeded(image);
    });
  } catch (err) {
    return response.send({ success: false, error: "Error opening file. Is it a valid image?" });
  }

  function processImageAsNeeded(image) {
    if (image.bitmap.width > 55) {
      let width = image.bitmap.width;
      let height = image.bitmap.height;
      let newWidth = (height * 50) / width;

      image.resize(50, newWidth);
      let resizedDestination = `${pathResult}/resized_${newName}`;

      image.write(resizedDestination, err => {
        response.send({ success: true, smallImagePath: "/" + resizedDestination }); //absolute for client, since it'll be react-redux base (or something else someday, perhaps)
      });
    } else {
      image.write(`${pathResult}/${newName}`, err => {
        response.send({ success: true, smallImagePath: `/${pathResult}/${newName}` }); //absolute for client, since it'll be react-redux base (or something else someday, perhaps)
      });
    }
  }
});

app.post("/react-redux/createUser", function(req, response) {
  let userDao = new UserDao(),
    username = req.body.username,
    password = req.body.password,
    rememberMe = req.body.rememberme == 1;

  userDao.checkUserExists(username, password).then(exists => {
    if (exists) {
      response.send({ errorCode: "s1" });
    } else {
      userDao.createUser(username, password, rememberMe).then(() => {
        userDao.sendActivationCode(username);
        response.send({});
      });
    }
  });
});

app.post("/react-redux/resetPassword", async function(req, response) {
  let { oldPassword, newPassword } = req.body;
  let userId = req.user.id;
  let result = await new UserDao().resetPassword(userId, oldPassword, newPassword);
  response.send({ ...result });
});

app.get("/activate", browseToReactRedux);
app.get("/activate/:code", function(req, response) {
  let userDao = new UserDao(),
    code = req.params.code;

  response.clearCookie("remember_me");
  req.logout();

  userDao.activateUser(code).then(
    result => {
      if (result.success) {
        req.login(result, function() {
          response.cookie("userId", result._id, { maxAge: 900000 });
          if (result.rememberMe) {
            response.cookie("remember_me", result.token, { path: "/", httpOnly: true, maxAge: rememberMeExpiration });
          }
          response.redirect("/activate");
        });
      } else {
        response.redirect(result.alreadyActivated ? "/activate?alreadyActivated=true" : "/activate");
      }
    },
    err => console.log(":(", err)
  );
});

process.on("uncaughtException", error);
process.on("unhandledRejection", error);
process.on("exit", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  dao.shutdown();
  process.exit();
}

function error(err) {
  try {
    let logger = new ErrorLoggerDao();
    logger.log("exception", err);
  } catch (e) {}
}

Promise.resolve(dao.init()).then(() => {
  app.listen(process.env.PORT || 3000);
  bookEntryQueueManager.initialize();
});

export default null;
