import * as functions from "firebase-functions";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
// Importing google cloud storage buckets so we can
// generate a one time link for our user
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";


// Now initalizing with our appilicationDefault credental
initializeApp({
  credential: applicationDefault(),
});

const firestore = new Firestore();
// Creating our storage instance:
const storage = new Storage();

// Creating our raw video bucket name
const rawVideoBucketName = "ts-yt-raw-videos";

// Building a function for adding a user to our database:
export const createUser = functions.auth.user().onCreate(async (user) =>{
  logger.info("Attempting to create user");

  // Creating user info
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  try {
    // Check access to the Firestore collection
    const collectionRef = firestore.collection("users");
    await collectionRef.get();

    // Add user information to Firestore
    await collectionRef.doc(user.uid).set(userInfo);

    logger.info("User Created: " , JSON.stringify(userInfo));
  } catch (error) {
    logger.error("Error accessing Firestore collection or creating user:"
      , error);
  }

  return;
});

// Creating a function to create our one time upload link
export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // Check if the user is authentication
  if (!request.auth) {
    // If not
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);

  // Generate a unique filename for upload
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return {url, fileName};
});
