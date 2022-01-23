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

const graphQLRouter = express.Router();
const authRouter = express.Router();
const svelteRouter = express.Router();

const IS_PUBLIC = process.env.IS_PUBLIC;
const PUBLIC_USER_ID = process.env.PUBLIC_USER_ID;
const PUBLIC_USER = {
  _id: PUBLIC_USER_ID,
  id: PUBLIC_USER_ID
};

const IS_DEV = process.env.IS_DEV;

const COOKIE_DOMAIN = IS_DEV ? ".lvh.me" : ".mylibrary.io";

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

app.use(session({ secret: "adam_booklist", saveUninitialized: true, resave: true, cookie: { domain: COOKIE_DOMAIN } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("remember-me"));

app.get("/favicon.ico", function (request, response) {
  response.sendFile(path.join(__dirname + "/favicon.ico"));
});

const authGraphQLCorsOptions = {
  origin: true
};

authRouter.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
authRouter.use(cors(authGraphQLCorsOptions));
app.use(subdomain("auth", authRouter));

graphQLRouter.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
graphQLRouter.use(cors(authGraphQLCorsOptions));
app.use(subdomain("graphql", graphQLRouter));

// maintain old path for now
app.post("/loginping", async function (request, response) {
  return response.send({});
});
authRouter.post("/loginping", async function (request, response) {
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

app.use(subdomain("svelte", svelteRouter));

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

svelteRouter.use(express.static(__dirname + "/svelte/dist"));

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

middleware(graphQLRouter, { url: "/", x: "REACT", mappingFile: path.resolve(__dirname, "./react/extracted_queries.json") });

graphQLRouter.use(
  "/",
  expressGraphql({
    schema: executableSchema,
    graphiql: true,
    rootValue: root
  })
);

const { rootPublic, executableSchemaPublic } = getPublicGraphqlSchema();
graphQLRouter.use(
  "/public",
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

app.use(express.static(__dirname + "/react/dist"));

// --------------- /REACT ---------------

// --------------- AUTH ---------------

authRouter.post("/login", passport.authenticate("local"), function (req, response) {
  // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
  let rememberMe = req.body.rememberme == 1;

  response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
  response.cookie("userId", req.user.id, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
  response.cookie("loginToken", req.user.loginToken, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
  response.cookie("email", req.user.email, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
  response.cookie("newAuth", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
  req.user.admin && response.cookie("admin", req.user.admin, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });

  if (rememberMe) {
    response.cookie("remember_me", `${req.user.id}|${req.user.loginToken}`, { path: "/", maxAge: rememberMeExpiration, domain: COOKIE_DOMAIN });
  }
  response.send(req.user);
});

authRouter.post("/logout", function (req, response) {
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

  response.clearCookie("logged_in", { domain: COOKIE_DOMAIN });
  response.clearCookie("remember_me", { domain: COOKIE_DOMAIN });
  response.clearCookie("userId", { domain: COOKIE_DOMAIN });
  response.clearCookie("loginToken", { domain: COOKIE_DOMAIN });
  response.clearCookie("email", { domain: COOKIE_DOMAIN });
  response.clearCookie("admin", { domain: COOKIE_DOMAIN });
  response.clearCookie("jr_admin", { domain: COOKIE_DOMAIN });
  response.clearCookie("newAuth", { domain: COOKIE_DOMAIN });
};

authRouter.post("/createUser", function (req, response) {
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

authRouter.post("/resetPassword", async function (req, response) {
  let { oldPassword, newPassword } = req.body;
  let userId = req.user.id;
  let result = await new UserDao().resetPassword(req.cookies["email"], userId, oldPassword, newPassword);
  response.send({ ...result });
});

authRouter.get("/activate", browseToReact);
authRouter.get("/activate/:id/:code", activateCode);

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

  response.clearCookie("remember_me", { domain: COOKIE_DOMAIN });
  req.logout();

  userDao.activateUser(userId, code).then(
    result => {
      if (result.success) {
        req.login(result, function () {
          const rememberMe = result.rememberMe;

          response.cookie("logged_in", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
          response.cookie("userId", "" + result._id, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
          response.cookie("loginToken", result.loginToken, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
          response.cookie("email", result.email, { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
          if (rememberMe) {
            response.cookie("remember_me", `${result._id}|${result.loginToken}`, {
              path: "/",
              httpOnly: true,
              maxAge: rememberMeExpiration,
              domain: COOKIE_DOMAIN
            });
          }
          response.cookie("newAuth", "true", { maxAge: rememberMe ? rememberMeExpiration : 900000, domain: COOKIE_DOMAIN });
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
