import admin from "firebase-admin";
import { FIREBASE_CONFIG } from "$env/static/private";

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
  });
}

export async function getUserIdFromToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken?.firebase.identities["google.com"]?.[0];
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}
