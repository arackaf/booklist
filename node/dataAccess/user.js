import AWS from "aws-sdk";
import DAO from "./dao";
import md5 from "blueimp-md5";
import { ObjectID } from "mongodb";
import sendEmail from "../app-helpers/sendEmail";

import uuid from "uuid/v4";
import moment from "moment";
import { db, getGetPacket, getPutPacket, getQueryPacket } from "./dynamoHelpers";

var salt = process.env.SALT;

const hour = 3600;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years
const getExpiration = rememberMe =>
  moment()
    .add(rememberMe ? rememberMeExpiration : 900, "seconds")
    .unix();

const newUsersSubjects = [
  { name: "History", path: null },
  { name: "Science", path: null },
  { name: "Literature", path: null },
  { name: "Economics", path: null },
  { name: "Law", path: null },
  { name: "Technology", path: null }
];

const siteRoot = subdomain => {
  if (subdomain) {
    return process.env.NODE_ENV == "production" ? `https://${subdomain}.mylibrary.io` : `http://${subdomain}.lvh.me:3000`;
  } else {
    return process.env.NODE_ENV == "production" ? "https://mylibrary.io" : "http://lvh.me:3000";
  }
};

async function wrapWithLoginToken(db, user) {
  if (user && !user.loginToken) {
    user.loginToken = uuid();
    await db.collection("users").updateOne({ _id: user._id }, { $set: { loginToken: user.loginToken } });
  }

  return user;
}

const TABLE_NAME = process.env.BOOKLIST_DYNAMO;

const getSessionKey = id => `UserLogin#${id}`;
const getLoginKey = loginToken => `LoginToken#${loginToken}`;

class UserDAO extends DAO {
  async createUser(email, password, rememberMe) {
    email = email.toLowerCase();

    const pk = `User#${email}`;
    const userId = uuid();
    const loginToken = uuid();

    const mainUserObject = {
      ...getPutPacket({
        pk,
        sk: pk,
        userId,
        email,
        password: this.saltAndHashPassword(password),
        created: moment().format("YYYY-MM-DD")
      }),
      ConditionExpression: "pk <> :idKeyVal",
      ExpressionAttributeValues: {
        ":idKeyVal": pk
      }
    };
    try {
      const userIdLookup = getPutPacket({ pk: getSessionKey(userId), sk: getLoginKey(loginToken), email, awaitingActivation: true, rememberMe });

      const items = [mainUserObject, userIdLookup];
      let res = await db.transactWrite({ TransactItems: items.map(item => ({ Put: item })) });

      return {
        email,
        userId,
        loginToken
      };
    } catch (er) {
      if (/\[ConditionalCheckFailed/.test(er.message)) {
        return { errorCode: "s1" };
      } else {
        return { errorCode: "sX" };
      }
    }
  }

  async activateUser(id, loginToken) {
    const sessionKey = getSessionKey(id);
    const loginKey = getLoginKey(loginToken);

    const item = await db.get(getGetPacket(sessionKey, loginKey));

    if (!item) {
      return { invalid: true };
    }
    if (!item.awaitingActivation) {
      return { alreadyActivated: true };
    }

    const rememberMe = item.rememberMe;

    await db.update({
      TableName: TABLE_NAME,
      Key: { pk: sessionKey, sk: loginKey },
      UpdateExpression: "SET rememberMe = :rememberMe, expires = :expires REMOVE awaitingActivation",
      ExpressionAttributeValues: { ":rememberMe": rememberMe, ":expires": getExpiration(rememberMe) }
    });

    return {
      success: true,
      rememberMe,
      _id: id,
      id: id,
      loginToken,
      email: item.email
    };
  }

  async lookupUser(email, password, rememberMe) {
    email = email.toLowerCase();
    password = this.saltAndHashPassword(password);
    let userFound = await db.queryOne(
      getQueryPacket(`pk = :userKey and sk = :userKey`, {
        ExpressionAttributeValues: { ":userKey": `User#${email}`, ":password": password },
        FilterExpression: ` password = :password `
      })
    );

    if (!userFound) {
      return null;
    }

    const id = userFound.userId;
    const loginToken = uuid();
    const sessionKey = getSessionKey(id);

    await db.put(getPutPacket({ pk: sessionKey, sk: getLoginKey(loginToken), email, rememberMe, expires: getExpiration(rememberMe) }));

    return {
      _id: id,
      id: id,
      loginToken,
      email
    };
  }

  async lookupUserByToken(token) {
    const [id, loginToken] = token.split("|");
    const sessionKey = getSessionKey(id);

    const item = await db.get(getGetPacket(getSessionKey(id), getLoginKey(loginToken)));

    if (!item) {
      return null;
    }

    return {
      id: id,
      _id: id,
      loginToken: loginToken,
      email: token.email
    };
  }

  async resetPassword(_id, oldPassword, newPassword) {
    let db = await super.open();
    try {
      let user = await db.collection("users").findOne({ _id: ObjectID(_id), password: this.saltAndHashPassword(oldPassword) });
      if (!user) {
        return { error: 1 };
      }
      await db.collection("users").update({ _id: ObjectID(_id) }, { $set: { password: this.saltAndHashPassword(newPassword) } });
      return { success: true };
    } finally {
      super.dispose(db);
    }
  }
  async sendActivationCode(id, loginToken, email, subdomain) {
    let url = `${siteRoot(subdomain)}/activate/${id}/${loginToken}`;

    await sendEmail({
      to: email,
      subject: "Activate your My Library account",
      html: `To activate your account, simply click <a href="${url}">here</a>.\n\n\nOr paste this url into a browser ${url}`
    });
  }
  async logout(_id) {
    //let db = await super.open();
    //await db.collection("users").updateOne({ _id: ObjectID(_id) }, { $set: { loginToken: "" } });
  }
  async deleteLogon(id, loginToken) {
    try {
      await db.deleteItem(getSessionKey(id), getLoginKey(loginToken));
    } catch (er) {}
  }
  saltAndHashPassword(password) {
    return md5(`${salt}${password}${salt}`);
  }
  getActivationToken(email) {
    email = email.toLowerCase();
    return md5(`${salt}${salt}${email}${salt}${salt}`);
  }

  async updateSubscription(userId, subscription) {
    let db = await super.open();
    try {
      await db.collection("users").update(
        { _id: ObjectID(userId) },
        {
          $set: { subscription }
        }
      );
    } catch (er) {}
  }
}

export default UserDAO;
