import AWS from "aws-sdk";
import DAO from "./dao";
import md5 from "blueimp-md5";
import { ObjectID } from "mongodb";
import sendEmail from "../app-helpers/sendEmail";

import uuid from "uuid/v4";
import moment from "moment";
import { db, makeGetGetPacket, makeGetPutPacket, makeGetQueryPacket } from "./dynamoHelpers";

var salt = process.env.SALT;

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
    return process.env.NODE_ENV == "production" ? "https://mylibrary.io" : "http://localhost:3000";
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

const getGetPacket = makeGetGetPacket(TABLE_NAME);
const getQueryPacket = makeGetQueryPacket(TABLE_NAME);
const getPutPacket = makeGetPutPacket(TABLE_NAME);
const getSessionKey = id => `UserLogin#${id}`;

class UserDAO extends DAO {
  async createUser(email, password, rememberMe) {
    let activationToken = this.getActivationToken(email);
    email = email.toLowerCase();

    const pk = `User#${email}`;
    const userId = uuid();

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
      const userIdLookup = getPutPacket({ pk: getSessionKey(userId), sk: getSessionKey(userId), activationToken, rememberMe });

      const items = [mainUserObject, userIdLookup];
      let res = await db.transactWrite({ TransactItems: items.map(item => ({ Put: item })) });

      return {
        email,
        userId,
        activationToken
      };
    } catch (er) {
      if (/\[ConditionalCheckFailed/.test(er.message)) {
        return { errorCode: "s1" };
      } else {
        return { errorCode: "sX" };
      }
    }
  }

  async lookupUser(email, password) {
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
    const sessionKey = getSessionKey(id);

    try {
      // just try and write it even if it's there, than risk a race condition in writing it if it doesn't exist, but having another write come through
      await db.put({
        ...getPutPacket({ pk: sessionKey, sk: sessionKey, loginToken: uuid() }),
        ConditionExpression: "pk <> :idKeyVal",
        ExpressionAttributeValues: {
          ":idKeyVal": sessionKey
        }
      });
    } catch (er) {}

    const currentLogin = await db.get(getGetPacket(sessionKey, sessionKey));

    return {
      _id: id,
      id: id,
      loginToken: currentLogin.loginToken
    };
  }

  async lookupUserByToken(token) {
    const [id, loginToken] = token.split("|");
    const sessionKey = getSessionKey(id);

    const item = await db.queryOne(
      getQueryPacket(`pk = :sessionKey AND sk = :sessionKey`, {
        ExpressionAttributeValues: { ":sessionKey": sessionKey, ":loginToken": loginToken },
        FilterExpression: ` loginToken = :loginToken `
      })
    );

    if (!item) {
      return null;
    }

    return {
      id: id,
      _id: id,
      loginToken: loginToken
    };
  }
  async activateUser(activationToken) {
    const id = activationToken;

    const sessionKey = getSessionKey(id);
    const item = await db.get(getGetPacket(sessionKey, sessionKey));
    if (!item) {
      return { invalid: true };
    }
    if (!item.activationToken) {
      return { alreadyActivated: true };
    }

    const loginToken = uuid();
    const rememberMe = item.rememberMe;

    await db.update({
      TableName: TABLE_NAME,
      Key: { pk: sessionKey, sk: sessionKey },
      UpdateExpression: "SET loginToken = :loginToken REMOVE activationToken, rememberMe",
      ExpressionAttributeValues: { ":loginToken": loginToken }
    });

    return {
      success: true,
      rememberMe,
      _id: id,
      id: id,
      loginToken
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
  async findByActivationToken(activationToken) {
    let db = await super.open();
    try {
      return await db.collection("users").findOne({ activationToken });
    } finally {
      super.dispose(db);
    }
  }
  async sendActivationCode(email, subdomain) {
    console.log("SUBDOMAIN", subdomain);
    email = email.toLowerCase();
    let code = this.getActivationToken(email);
    let url = `${siteRoot(subdomain)}/activate/${code}`;

    await sendEmail({
      to: email,
      subject: "Activate your My Library account",
      html: `To activate your account, simply click <a href="${url}">here</a>.\n\n\nOr paste this url into a browser ${url}`
    });
  }
  async logout(_id) {
    let db = await super.open();
    await db.collection("users").updateOne({ _id: ObjectID(_id) }, { $set: { loginToken: "" } });
  }
  saltAndHashPassword(password) {
    return md5(`${salt}${password}${salt}`);
  }
  saltAndHashToken(email) {
    email = email.toLowerCase();
    return md5(`${salt}${email}${salt}`);
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
