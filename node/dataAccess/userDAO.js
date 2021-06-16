import DAO from "./dao";
import md5 from "blueimp-md5";
import { ObjectID } from "mongodb";
import sendEmail from "../app-helpers/sendEmail";

import uuid from "uuid/v4";

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

class UserDAO extends DAO {
  async createUser(email, password, rememberMe) {
    email = email.toLowerCase();
    let db = await super.open();
    try {
      let activationToken = this.getActivationToken(email),
        newUser = { email, password: this.saltAndHashPassword(password), token: this.saltAndHashToken(email), rememberMe, activationToken };

      await db.collection("users").insert(newUser);
      let subjectsToInsert = newUsersSubjects.map(s => ({ ...s, userId: "" + newUser._id }));
      await db.collection("subjects").insert(subjectsToInsert);
      return newUser;
    } catch (eee) {
      console.log(eee);
    } finally {
      super.dispose(db);
    }
  }
  async lookupUser(email, password) {
    email = email.toLowerCase();
    let db = await super.open();
    try {
      return wrapWithLoginToken(db, await db.collection("users").findOne({ activated: true, email, password: this.saltAndHashPassword(password) }));
    } finally {
      super.dispose(db);
    }
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
