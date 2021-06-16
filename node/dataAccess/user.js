import AWS from "aws-sdk";
import DAO from "./dao";
import md5 from "blueimp-md5";
import { ObjectID } from "mongodb";
import sendEmail from "../app-helpers/sendEmail";

import uuid from "uuid/v4";
import moment from "moment";

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
const db = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});

const getGetPacket = (pk, sk) => ({ TableName: TABLE_NAME, Key: { pk, sk } });

const getPutPacket = obj => ({ TableName: TABLE_NAME, Item: obj });

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
      const userIdLookup = getPutPacket({ pk: `User#login-status-lookup#${userId}`, sk: `User#login-status-lookup#${userId}`, activationToken });

      const items = [mainUserObject, userIdLookup];
      let res = await db.transactWrite({ TransactItems: items.map(item => ({ Put: item })) }).promise();
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
    let result = await db.get(getGetPacket(`User#${email}`, `User#${email}`)).promise();

    const userExists = (result && result.Item && result.Item.password) === password;

    if (!userExists) {
      return null;
    }

    const id = result.Item.userId;
    const sessionKey = `UserLogin#${id}`;

    try {
      // just try and write it even if it's there, than risk a race condition in writing it if it doesn't exist, but having another write come through
      await db
        .put({
          ...getPutPacket({ pk: sessionKey, sk: sessionKey, loginToken: uuid() }),
          ConditionExpression: "pk <> :idKeyVal",
          ExpressionAttributeValues: {
            ":idKeyVal": sessionKey
          }
        })
        .promise();
    } catch (er) {}

    const currentLogin = await db.get(getGetPacket(sessionKey, sessionKey)).promise();
    if (!currentLogin.Item) {
      return null; // wtf
    }

    return {
      _id: id,
      id: id,
      loginToken: currentLogin.Item.loginToken
    };
  }

  async lookupUserByToken(token) {
    let db = await super.open();
    try {
      return wrapWithLoginToken(db, await db.collection("users").findOne({ token }));
    } finally {
      super.dispose(db);
    }
  }
  async activateUser(activationToken) {
    let db = await super.open();
    try {
      let user = await db.collection("users").findOne({ activationToken });

      if (!user) {
        return { invalid: true };
      }
      if (user.activated) {
        return { alreadyActivated: true };
      }

      user.loginToken = uuid();

      await db.collection("users").update(
        { _id: user._id },
        {
          $set: { activated: true, loginToken: user.loginToken },
          $unset: { rememberMe: "" }
        }
      );
      return {
        success: true,
        rememberMe: user.rememberMe,
        username: user.email,
        _id: user._id,
        id: user._id,
        loginToken: user.loginToken,
        token: user.token
      };
    } catch (err) {
      console.log("oops", err);
    } finally {
      super.dispose(db);
    }
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
  async findById(_id) {
    let db = await super.open();
    try {
      return await db.collection("users").findOne({ _id: ObjectID(_id) });
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
  async getSubscription(userId) {
    let db = await super.open();
    try {
      let user = await this.findById(userId);
      return user.subscription;
    } catch (er) {}
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
