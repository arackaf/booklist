import dao from "./node/dataAccess/dao";
import bookEntryQueueManager from "./node/app-helpers/bookEntryQueueManager";
import bookSimilarityQueueManager from "./node/app-helpers/bookSimilarityQueueManager";
import ErrorLoggerDao from "./node/dataAccess/errorLoggerDAO";
import UserDao from "./node/dataAccess/userDAO";

import express, { response } from "express";
const app = express();
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import compression from "compression";

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as RememberMeStrategy } from "passport-remember-me";

import { easyControllers } from "easy-express-controllers";
import expressWsImport from "express-ws";
import webpush from "web-push";

import expressGraphql from "express-graphql";

import { middleware } from "generic-persistgraphql";
import { getPublicGraphqlSchema, getGraphqlSchema } from "./node/util/graphqlUtils";

import uuid from "uuid/v4";
import { getJrDbConnection } from "./node/util/dbUtils";

import AWS from "aws-sdk";
AWS.config.region = "us-east-1";

const IS_PUBLIC = process.env.IS_PUBLIC;
const PUBLIC_USER_ID = process.env.PUBLIC_USER_ID;
const PUBLIC_USER = {
  _id: PUBLIC_USER_ID,
  id: PUBLIC_USER_ID
};

const IS_DEV = process.env.IS_DEV;

const jr_admins = new Set(process.env.JELLYROLLS_ADMINS.split(",").filter(id => id));

if (!IS_DEV) {
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

export const JrConn = getJrDbConnection();

passport.use(
  new LocalStrategy(function(email, password, done) {
    if (IS_PUBLIC) {
      return done(null, PUBLIC_USER);
    }
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
  return done(undefined, { id: "" + id, _id: "" + id, admin: id == process.env.ADMIN_USER, jr_admin: jr_admins.has(id) });
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

const { root, executableSchema } = getGraphqlSchema();
export { root, executableSchema };

middleware(app, { url: "/graphql", mappingFile: path.resolve(__dirname, "./react/extracted_queries.json") });
middleware(app, { url: "/graphql-public", mappingFile: path.resolve(__dirname, "./react/extracted_queries.json") });
app.use(
  "/graphql",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

const { rootPublic, executableSchemaPublic } = getPublicGraphqlSchema();

app.use("/graphql-public", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
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

const statics = ["/static/", "/node_modules/", "/react/", "/utils/"];
statics.forEach(folder => app.use(folder, express.static(__dirname + folder)));

app.ws("/bookEntryWS", function(ws, req) {
  bookEntryQueueManager.subscriberAdded(req.user.id, ws);
});

easyControllers.createAllControllers(app, { fileTest: f => !/-es6.js$/.test(f) }, { __dirname: "./node" });

app.use("/compare/react/", express.static(__dirname + "/compare/react/"));
app.get("/compare/react", (req, res) => {
  res.sendFile(path.join(__dirname + "/compare/react/dist/index.html"));
});

const modules = ["", "books", "login", "subjects", "settings", "scan", "home", "view", "admin", "styledemo", "react", "jr"];
modules.forEach(name => app.get("/" + name, browseToReact));

app.get("/*.js", express.static(__dirname + "/react/dist/"));

function browseToReact(request, response) {
  if (!request.user) {
    clearAllCookies(response);
  }
  response.sendFile(path.join(__dirname + "/react/dist/index.html"));
}

app.get("/favicon.ico", function(request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

app.post("/react/login", passport.authenticate("local"), function(req, response) {
  // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
  let rememberMe = req.body.rememberme == 1;

  response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("userId", req.user.id, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("loginToken", req.user.loginToken, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  req.user.admin && response.cookie("admin", req.user.admin, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  req.user.jr_admin && response.cookie("jr_admin", req.user.jr_admin, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  if (rememberMe) {
    response.cookie("remember_me", req.user.token, { path: "/", httpOnly: true, maxAge: rememberMeExpiration });
  }
  response.send(req.user);
});

app.post("/react/logout", function(req, response) {
  let userDao = new UserDao();
  userDao.logout(req.user.id);

  clearAllCookies(response);
  req.logout();
  response.send({});
});

const clearAllCookies = response => {
  response.clearCookie("logged_in");
  response.clearCookie("remember_me");
  response.clearCookie("userId");
  response.clearCookie("loginToken");
  response.clearCookie("admin");
  response.clearCookie("jr_admin");
};

app.post("/react/createUser", function(req, response) {
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

app.post("/react/resetPassword", async function(req, response) {
  let { oldPassword, newPassword } = req.body;
  let userId = req.user.id;
  let result = await new UserDao().resetPassword(userId, oldPassword, newPassword);
  response.send({ ...result });
});

app.get("/activate", browseToReact);
app.get("/activate/:code", function(req, response) {
  let userDao = new UserDao(),
    code = req.params.code;

  response.clearCookie("remember_me");
  req.logout();

  userDao.activateUser(code).then(
    result => {
      if (result.success) {
        req.login(result, function() {
          response.cookie("logged_in", "true", { maxAge: 900000 });
          response.cookie("userId", result._id, { maxAge: 900000 });
          response.cookie("loginToken", result.loginToken, { maxAge: 900000 });
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
  if (!IS_PUBLIC) {
    bookEntryQueueManager.initialize();
    bookSimilarityQueueManager.initialize();
  }
});

export default null;
