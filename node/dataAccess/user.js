import AWS from "aws-sdk";
import md5 from "blueimp-md5";
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

const TABLE_NAME = process.env.BOOKLIST_DYNAMO;

const getSessionKey = id => `UserLogin#${id}`;
const getLoginKey = loginToken => `LoginToken#${loginToken}`;

class UserDAO {
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
        gsiUserLookupPk: userId,
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

  async getUser(email, userId) {
    email = email.toLowerCase();
    const userKey = `User#${email}`;
    return db.get(getGetPacket(userKey, userKey));
  }

  async getPublicUser(userId) {
    return db.queryOne(
      getQueryPacket(`gsiUserLookupPk = :userId`, {
        IndexName: "gsiUserLookup",
        ExpressionAttributeValues: { ":userId": userId, ":true": true },
        FilterExpression: ` isPublic = :true `
      })
    );
  }

  async lookupUser(email, password, rememberMe) {
    email = email.toLowerCase();
    password = this.saltAndHashPassword(password);
    const userKey = `User#${email}`;

    let userFound = await db.get(
      getGetPacket(userKey, userKey, {
        ExpressionAttributeValues: { ":password": password },
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
      email,
      admin: userFound.admin
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

  async updateUser(email, userId, updates) {
    email = email.toLowerCase();

    const pk = `User#${email}`;

    return db.update({
      TableName: TABLE_NAME,
      Key: { pk, sk: pk },
      UpdateExpression: "SET isPublic = :isPublic, publicName = :publicName, publicBooksHeader = :publicBooksHeader",
      ConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":isPublic": updates.isPublic,
        ":publicName": updates.publicName,
        ":publicBooksHeader": updates.publicBooksHeader
      },
      ReturnValues: "ALL_NEW"
    });
  }

  async resetPassword(email, userId, oldPassword, newPassword) {
    email = email.toLowerCase();
    const pk = `User#${email}`;

    try {
      let val = await db.update({
        TableName: TABLE_NAME,
        Key: { pk, sk: pk },
        UpdateExpression: "SET password = :newPassword",
        ConditionExpression: "userId = :userId AND password = :oldPassword",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":oldPassword": this.saltAndHashPassword(oldPassword),
          ":newPassword": this.saltAndHashPassword(newPassword)
        }
      });
      return { success: true };
    } catch (er) {
      return { error: 1 };
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
  async deleteLogon(id, loginToken) {
    try {
      await db.deleteItem(getSessionKey(id), getLoginKey(loginToken));
    } catch (er) {}
  }
  saltAndHashPassword(password) {
    return md5(`${salt}${password}${salt}`);
  }
}

export default UserDAO;
