

import { credential } from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */


const videoCollectionId = 'videos';

// Creating an interface which defines the information we expect
// Our posted videos to contain
export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string
}
/* getVideo

Purpose: Given a video ID we wish to be able to get our video from
firestore

VideoId (String) -> Video (The type we declared above which contains 
descriptions about the video itself)
*/
async function getVideo(videoId: string) {
    // Getting our video as a snapshot
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  // Getting the data from our snapshot as a video
  return (snapshot.data() as Video) ?? {};
}

/* setVideo

Purpose: Setting the descritpion for a video given the ID (Location)
(Here we are taking in the video and adding "MetaData" like who uploaded
it and it's title etc)

*/
export function setVideo(videoId: string, video: Video) {
    // Parsing all fo the information 
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    // Here we set Merge to true so we can add aditional (Missing data)
    // Without overwriting the data that already exists there: 
    .set(video, { merge: true })
}

/* isVideoNew

Purpose: Check if the provided video is new by seeing if there
already exists a status for this file location 

Signiture: VideoLink -> Bool 
*/
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}
