import admin from "firebase-admin";
import { FIREBASE_CONFIG } from "$env/static/private";

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);
firebaseConfig.private_key = firebaseConfig.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig)
});

export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token is valid");
    console.log(decodedToken);
    console.log(decodedToken?.firebase.identities["google.com"]);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}
