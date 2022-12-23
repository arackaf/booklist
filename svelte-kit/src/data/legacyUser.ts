import md5 from "blueimp-md5";
import { env } from "$env/dynamic/private";

import { db, getQueryPacket } from "./dynamoHelpers";

const salt = env.SALT;

export async function lookupUser(email: string, password: string) {
  email = email.toLowerCase();
  password = saltAndHashPassword(password);
  const userKey = `User#${email}`;

  try {
    let userFound = await db.queryOne(
      getQueryPacket(` pk = :userKey AND sk = :userKey `, {
        ExpressionAttributeValues: { ":password": password, ":userKey": userKey, ":true": true },
        FilterExpression: ` password = :password AND awaitingActivation <> :true `
      })
    );

    if (!userFound) {
      return null;
    }

    const id = userFound.userId;

    return {
      id
    };
  } catch (loginErr) {
    console.log("Login error", loginErr);
    return null;
  }
}

function saltAndHashPassword(password: string) {
  return md5(`${salt}${password}${salt}`);
}
