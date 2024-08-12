// Importing our functions
import {httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
// Getting an instance of our functions so we can invoke them 

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}
// Creating our actual get videos function:
export async function getVideos() {
  const response: any = await getVideosFunction();
  return response.data as Video[];
}
// Getting our generate upload url endpoint by passing the instance of
// our functions, and the name of the endpoint function we wish to call
// It gets the instance of our firebase from te firebase.ts file 
const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');
// Creating a function for getting our videos:
// This is boilerplate for our actual function:
const getVideosFunction = httpsCallable(functions, 'getVideos');
// Defining our video information so we can consistnetly
// interact with it 


// Creating our upload video function:
// -> This is what handles creating both the URL and processing the file 
// so that the correct parameters can be used 
export async function uploadVideo(file: File) {
    const response: any = await generateUploadUrlFunction({
        // Take the file uploaded and split it into it's components,
        // then save the last one by popping it so we know the file type:
      fileExtension: file.name.split('.').pop()
    });
  
    // Upload the file to the signed URL
    const uploadResult = await fetch(response?.data?.url, {
        // Definitions of our URL 
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  
    return uploadResult;
  }