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
import { Strategy as RememberMeStrategy } from "passport-remember-me";

import expressGraphql from "express-graphql";

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
    const rememberMe = request.body.rememberme == 1;
    let userDao = new UserDao();

    userDao.lookupUser(email, password, rememberMe).then(userResult => {
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
    function (token, done) {
      consumeRememberMeToken(token, function (err, userResult) {
        if (err) {
          return done(err);
        }
        if (!userResult) {
          return done(null, false);
        }

        done(null, userResult);
      });
    },
    function (user, done) {
      return done(null, `${user.id}|${user.loginToken}`);
    }
  )
);

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
app.use(passport.authenticate("remember-me"));

app.get("/favicon.ico", function (request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

const authGraphQLCorsOptions = {
  origin: true
};

app.post("/auth/loginping", async function (request, response) {
  const loginToken = (request.cookies || {}).loginToken;
  if (!(await db.get(getGetPacket(`UserLogin#${request.user.id}`, `LoginToken#${loginToken}`)))) {
    clearAllCookies(request, response);
    request.logout();
    return response.send({ logout: true });
  } else {
    return response.send({});
  }
});

/* --------------- SVELTE --------------- */

const svelteModules = ["", "books", "login", "subjects", "settings", "scan", "home", "view", "admin", "styledemo", "activate"];
const validSvelteNonAuthModules = ["", "home", "login"];
const browseToSvelte = moduleName => async (request, response) => {
  if (!request.user) {
    clearAllCookies(request, response);
  }
  response.sendFile(path.join(__dirname + "/svelte/dist/index.html"));
};
svelteModules.forEach(name => svelteRouter.get("/" + name, browseToSvelte(name)));

svelteRouter.get("/activate/:code", activateCode);

app.use("/svelte/dist", express.static(__dirname + "/svelte/dist", { maxAge: 432000 * 1000 * 10 /* 50 days * 1000ms */ }));
svelteRouter.use(cors(), express.static(__dirname + "/svelte/dist", { maxAge: 432000 * 1000 * 10 /* 50 days * 1000ms */ }));

app.use(subdomain("svelte", svelteRouter));

/* --------------- /SVELTE --------------- */

const { root, executableSchema } = getGraphqlSchema();
export { root, executableSchema };

middleware(svelteRouter, { url: "/graphql", x: "SVELTE", mappingFile: path.resolve(__dirname, "./svelte/extracted_queries.json") });
svelteRouter.use(
  "/graphql",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

middleware(app, { url: "/graphql", x: "REACT", mappingFile: path.resolve(__dirname, "./react/extracted_queries.json") });

app.use(
  "/graphql",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

const { rootPublic, executableSchemaPublic } = getPublicGraphqlSchema();
app.use(
  "/graphql-public",
  cors(),
  expressGraphql({
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
  response.sendFile(path.join(__dirname + "/react/dist/index.html"));
}

app.use(express.static(__dirname + "/react/dist", { maxAge: 432000 * 1000 * 10 /* 50 days * 1000ms */ }));

// --------------- /REACT ---------------

// --------------- AUTH ---------------

app.post("/auth/login", passport.authenticate("local"), function (req, response) {
  // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
  let rememberMe = req.body.rememberme == 1;

  response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("userId", req.user.id, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("loginToken", req.user.loginToken, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("email", req.user.email, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  response.cookie("newAuth2", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
  req.user.admin && response.cookie("admin", req.user.admin, { maxAge: rememberMe ? rememberMeExpiration : 900000 });

  if (rememberMe) {
    response.cookie("remember_me", `${req.user.id}|${req.user.loginToken}`, { path: "/", maxAge: rememberMeExpiration });
  }
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
  response.clearCookie("remember_me");
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
  let rememberMe = req.body.rememberme == 1;

  //TODO: get rid of this call

  userDao.createUser(username, password, rememberMe).then(result => {
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

app.get("/auth/activate", browseToReact);
app.get("/auth/activate/:id/:code", activateCode);

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

  response.clearCookie("remember_me");
  req.logout();

  userDao.activateUser(userId, code).then(
    result => {
      if (result.success) {
        req.login(result, function () {
          const rememberMe = result.rememberMe;

          response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
          response.cookie("userId", "" + result._id, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
          response.cookie("loginToken", result.loginToken, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
          response.cookie("email", result.email, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
          if (rememberMe) {
            response.cookie("remember_me", `${result._id}|${result.loginToken}`, {
              path: "/",
              httpOnly: true,
              maxAge: rememberMeExpiration
            });
          }
          response.cookie("newAuth2", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000 });
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
});

export default null;
