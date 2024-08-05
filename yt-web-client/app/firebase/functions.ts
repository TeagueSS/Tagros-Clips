// Importing our functions
import { getFunctions, httpsCallable } from 'firebase/functions';
// Getting an instance of our functions so we can invoke them 
const functions = getFunctions();
// Getting our generate upload url endpoint by passing the instance of
// our functions, and the name of the endpoint function we wish to call
// It gets the instance of our firebase from te firebase.ts file 
const generateUploadUrlFunction = httpsCallable(functions, 'generateUploadUrl');

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