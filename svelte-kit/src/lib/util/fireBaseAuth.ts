import admin from "firebase-admin";
import { env } from "$env/dynamic/private";
const { FIREBASE_CONFIG } = env;

import { getUserSync } from "$data/legacyUser";

import { building } from "$app/environment";

if (!building) {
  const firebaseConfig = JSON.parse(FIREBASE_CONFIG);
  firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, "\n");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig)
    });
  }
}

async function getGoogleIdFromToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken?.firebase.identities["google.com"]?.[0];
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}

export async function getUserIdFromToken(token: string | null) {
  if (!token) {
    return "";
  }

  let userId = await getGoogleIdFromToken(token);

  if (!userId) {
    return "";
  }
  userId = (await getUserSync(userId)) || userId;
  return userId;
}
