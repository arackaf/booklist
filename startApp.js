import dao from "./node/dataAccess/dao";
import ErrorLoggerDao from "./node/dataAccess/errorLoggerDAO";
import UserDao from "./node/dataAccess/user";

import express, { response } from "express";
import subdomain from "express-subdomain";
import cors from "cors";
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

import { graphqlHTTP } from "express-graphql";

import { middleware } from "generic-persistgraphql";
import { getPublicGraphqlSchema, getGraphqlSchema } from "./node/util/graphqlUtils";

import AWS from "aws-sdk";
import { db, getGetPacket } from "./node/dataAccess/dynamoHelpers";
AWS.config.region = "us-east-1";

const svelteRouter = express.Router();

const IS_PUBLIC = process.env.IS_PUBLIC;
const PUBLIC_USER_ID = process.env.PUBLIC_USER_ID;
const PUBLIC_USER = {
  _id: PUBLIC_USER_ID,
  id: PUBLIC_USER_ID
};

const IS_DEV = process.env.IS_DEV;

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

passport.use(
  new LocalStrategy({ passReqToCallback: true }, function (request, email, password, done) {
    if (IS_PUBLIC) {
      return done(null, PUBLIC_USER);
    }

    const loginToken = (request.cookies || {}).loginToken;
    const userId = (request.cookies || {}).userId;

    if (request.url === "/graphql-ios") {
      const loginToken = request.body.loginToken;
      const userResult = iosUserCache[loginToken];

      return done(null, userResult || null);
    } else if (request.url.indexOf("/graphql") !== -1) {
      console.log("AAA");
      Promise.resolve(hanldeLoginPing(response, request.user, userId, loginToken, 1))
        .then(res => {
          const { user, refresh } = res;

          if (user) {
            done(null, user);
          } else {
            request.refresh = refresh;
          }
        })
        .catch(er => {
          request.logout();
          done(null, false, { message: "No login found" });
        });
    } else if (request.url.indexOf("/loginping") !== -1) {
      Promise.resolve(hanldeLoginPing(response, request.user, userId, loginToken))
        .then(res => {
          const { user, refresh } = res;

          if (user) {
            done(null, user);
          } else {
            request.refresh = refresh;
          }
        })
        .catch(er => {
          request.logout();
          done(null, false, { message: "No login found" });
        });
    } else {
      const userDao = new UserDao();
      userDao.lookupUser(email, password).then(userResult => {
        if (userResult) {
          userResult.id = "" + userResult._id;
          done(null, userResult);
        } else {
          done(null, false, { message: "Incorrect login" });
        }
      });
    }
  })
);

async function hanldeLoginPing(response, currentUser, userId, loginToken, log) {
  console.log("a");
  let loginPacket;

  const userDao = new UserDao();
  if (loginToken && userId) {
    loginPacket = await db.get(getGetPacket(`UserLogin#${userId}`, `LoginToken#${loginToken}`));
  }
  log && console.log("b");

  if (!loginPacket || !loginPacket.email) {
    throw "No existing, valid login";
  }
  log && console.log("c");

  if (currentUser) {
    log && console.log("d");
    return { user: currentUser };
  } else {
    try {
      log && console.log("e");
      const { admin } = await userDao.getUser(loginPacket.email);

      log && console.log("f");
      const user = {
        _id: userId,
        id: userId,
        admin
      };

      log && console.log("g");
      return { user, refresh: true };
    } catch (er) {
      log && console.log("h", er);
      console.log(er);
      throw er;
    }
  }
}

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  return done(undefined, { id: "" + id, _id: "" + id, admin: id == process.env.ADMIN_USER });
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

app.get("/favicon.ico", function (request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

app.use("/auth/loginping", function (req, response, next) {
  req.body.username = "xxx";
  req.body.password = "xxx";
  next();
});
app.post("/auth/loginping", passport.authenticate("local"), function (request, response) {
  // login successful
  return response.send({ valid: true, refresh: request.refresh });
});

/* --------------- SVELTE --------------- */

const svelteModules = ["", "books", "login", "subjects", "settings", "scan", "home", "view", "admin", "styledemo"];
const validSvelteNonAuthModules = ["", "home", "login"];
const browseToSvelte = moduleName => async (request, response) => {
  if (!request.user) {
    clearAllCookies(request, response);
  }
  response.sendFile(path.join(__dirname + "/svelte/dist/index.html"));
};
svelteModules.forEach(name => svelteRouter.get("/" + name, browseToSvelte(name)));

svelteRouter.use("/activate", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
svelteRouter.use("/activate/:id/:code", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
svelteRouter.get("/activate", browseToSvelte("activate"));
svelteRouter.get("/activate/:id/:code", activateCode);

svelteRouter.get("/service-worker.js", express.static(__dirname + "/svelte/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
svelteRouter.get("/sw-index-bundle.js", express.static(__dirname + "/svelte/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
svelteRouter.get("/index.html", express.static(__dirname + "/svelte/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
svelteRouter.use(cors(), express.static(__dirname + "/svelte/dist", { maxAge: 432000 * 1000 * 10 /* 50 days * 1000ms */ }));

app.use(subdomain("svelte", svelteRouter));
app.use(subdomain("svelte-app", svelteRouter));

/* --------------- /SVELTE --------------- */

const { root, executableSchema } = getGraphqlSchema();
export { root, executableSchema };

middleware(svelteRouter, { url: "/graphql", x: "SVELTE", mappingFile: path.resolve(__dirname, "./svelte/extracted_queries.json") });
svelteRouter.use("/graphql", (req, res, next) => {
  res.set("Cache-Control", "no-cache");
  next();
});
svelteRouter.use(
  "/graphql",
  graphqlHTTP({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

middleware(app, { url: "/graphql", x: "REACT", mappingFile: path.resolve(__dirname, "./react/extracted_queries.json") });

app.use("/graphql", (req, res, next) => {
  res.set("Cache-Control", "no-cache");
  next();
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

app.use("/graphql-ios", function (req, response, next) {
  req.body.username = "xxx";
  req.body.password = "xxx";
  next();
});
app.post("/graphql-ios", passport.authenticate("local"), function (req, response) {
  return response.redirect(307, "/graphql");
});

const { rootPublic, executableSchemaPublic } = getPublicGraphqlSchema();
app.use(
  "/graphql-public",
  cors(),
  graphqlHTTP({
    schema: executableSchemaPublic,
    graphiql: true,
    rootValue: rootPublic
  })
);

// --------------- REACT ---------------

const modules = ["", "books", "login", "subjects", "settings", "scan", "home", "view", "admin", "styledemo", "react"];
modules.forEach(name => app.get("/" + name, browseToReact));

async function browseToReact(request, response) {
  if (!request.user) {
    clearAllCookies(request, response);
  }
  response.set("Cache-Control", "no-cache");
  response.sendFile(path.join(__dirname + "/react/dist/index.html"));
}

app.get("/service-worker.js", express.static(__dirname + "/react/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
app.get("/sw-index-bundle.js", express.static(__dirname + "/react/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
app.get("/index.html", express.static(__dirname + "/react/dist", { setHeaders: resp => resp.set("Cache-Control", "no-cache") }));
app.use(express.static(__dirname + "/react/dist", { maxAge: 432000 * 1000 * 10 /* 50 days * 1000ms */ }));
// --------------- /REACT ---------------

// --------------- AUTH ---------------

const iosUserCache = {};
const iosUserCacheLoginTokenLookup = {};

app.post("/login-ios", function (req, response) {
  const userDao = new UserDao();
  const { email, password } = req.body;

  const loginToken = iosUserCacheLoginTokenLookup[email];
  if (loginToken) {
    return response.json({ success: true, loginToken });
  }

  userDao.lookupUser(email, password, true).then(userResult => {
    if (userResult) {
      userResult.id = "" + userResult._id;
      iosUserCache[userResult.loginToken] = userResult;
      iosUserCacheLoginTokenLookup[userResult.email] = userResult.loginToken;

      return response.json({ success: true, loginToken: userResult.loginToken });
    } else {
      return response.json({ success: false });
    }
  });
});

app.post("/auth/login", passport.authenticate("local"), function (req, response) {
  // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
  response.cookie("logged_in", "true", { maxAge: rememberMeExpiration });
  response.cookie("userId", req.user.id, { maxAge: rememberMeExpiration });
  response.cookie("loginToken", req.user.loginToken, { maxAge: rememberMeExpiration });
  response.cookie("email", req.user.email, { maxAge: rememberMeExpiration });
  response.cookie("newAuth", "true", { maxAge: rememberMeExpiration });
  response.cookie("newAuth2", "true", { maxAge: rememberMeExpiration });
  req.user.admin && response.cookie("admin", req.user.admin, { maxAge: rememberMeExpiration });

  response.send(req.user);
});

app.post("/auth/logout", function (req, response) {
  clearAllCookies(req, response);
  req.logout();
  response.send({});
});

const clearAllCookies = (request, response) => {
  let logonToken = request.cookies["loginToken"];
  let userId = request.cookies["userId"];

  if (logonToken && userId) {
    let userDao = new UserDao();
    userDao.deleteLogon(userId, logonToken);
  }

  response.clearCookie("logged_in");
  response.clearCookie("userId");
  response.clearCookie("loginToken");
  response.clearCookie("email");
  response.clearCookie("admin");
  response.clearCookie("jr_admin");
  response.clearCookie("newAuth");
  response.clearCookie("newAuth2");
};

app.post("/auth/createUser", function (req, response) {
  let userDao = new UserDao();
  let username = req.body.username;
  let password = req.body.password;

  //TODO: get rid of this call

  userDao.createUser(username, password).then(result => {
    if (result.errorCode) {
      response.send({ errorCode: result.errorCode });
    } else {
      userDao.sendActivationCode(result.userId, result.loginToken, result.email, (req.subdomains || [])[0] || "");
      response.send({});
    }
  });
});

app.post("/auth/resetPassword", async function (req, response) {
  let { oldPassword, newPassword } = req.body;
  let userId = req.user.id;
  let result = await new UserDao().resetPassword(req.cookies["email"], userId, oldPassword, newPassword);
  response.send({ ...result });
});

app.use("/activate", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/activate/:id/:code", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.get("/activate", browseToReact);
app.get("/activate/:id/:code", activateCode);

async function activateCode(req, response) {
  let userDao = new UserDao();
  let userId = req.params.id;
  let code = req.params.code;

  if (req.user) {
    try {
      if (req.params.id == req.user._id) {
        return response.redirect("/activate?alreadyActivated=true");
      }
    } catch (er) {}
  }

  req.logout();

  userDao.activateUser(userId, code).then(
    result => {
      if (result.success) {
        req.login(result, function () {
          response.cookie("logged_in", "true", { maxAge: rememberMeExpiration });
          response.cookie("userId", "" + result._id, { maxAge: rememberMeExpiration });
          response.cookie("loginToken", result.loginToken, { maxAge: rememberMeExpiration });
          response.cookie("email", result.email, { maxAge: rememberMeExpiration });
          response.cookie("newAuth", "true", { maxAge: rememberMeExpiration });
          response.cookie("newAuth2", "true", { maxAge: rememberMeExpiration });
          response.redirect("/activate");
        });
      } else {
        response.redirect(result.alreadyActivated ? "/activate?alreadyActivated=true" : "/activate");
      }
    },
    err => console.log(":(", err)
  );
}

// --------------- /AUTH ---------------

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
  app.listen(process.env.PORT || 3001);
  console.log("Listening ...");
});

export default null;
