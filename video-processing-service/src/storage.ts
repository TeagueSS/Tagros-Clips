// Keeping track of our:
// -> 1. Google Cloud Storage file interactions (GCS)
// -> 2. Local file interactions

// Importing our Google Cloud storage
import { Storage } from "@google-cloud/storage";
// Importing our node JS file system 
import fs from 'fs';
// Importing ffmpeg (Our Video Trascoder)
import ffmpeg from "fluent-ffmpeg";
import { resolve } from "path";

//Creating an instance of GCS 
const storage = new Storage();
// Defining our bucket names:
const rawVideoBucketName = "ts-yt-raw-videos";
const processedVideoBucketName = "ts-yt-processed-videos";
// Once videos are processed we can place them into this folder:
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";


// Creating a functions to ensure that our local directories exist 
// when trying to start up our processing service:
/**
 * Creates the local directories for raw and processed videos.
 */
export function setupDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}



/**
 *  @param rawVideoName  - the name of the file we are converting from {@link localRawVideoPath}.
 *  @param processedVideoName - the name of the output file {@link localProcessedVideoPath}.
 * @returns a promise that resolves when the video has been convereted.
 */
export function convertVideo(rawVideoName: string , processedVideoName: string)
{
    // Creating a Java Script Promise:
    return new Promise<void>((resolve,reject) => 
        {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        // Defining our video transcode options
        .outputOptions('-vf', 'scale=-1:360') // Video File and 360p
        // On completion we define this function:
        .on('end', function() 
        {
            // If it worked we can tell them that our video posted correctly:
            console.log('Processing finished successfully');
        })
        // Creating a function to handle our error:
        .on('error', function(err: any) 
        {
            console.log('An error occurred: ' + err.message);
            // Sending back our error through the reject of our promise 
            reject(err);
        })
        // Saving our output file path
        .save(`${localProcessedVideoPath}/${processedVideoName}`);
        }
    )
}

/**
 * Purpose:
 * Download videos from our google cloud storage for processing
 * 
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string) {
    // Downloading our video by defining our bucket, file name, and transfer path
    // Await makes everything else in this function wait for our promise to be fulfilled
    // as such by using Async with await this function is itself a promise
    await storage.bucket(rawVideoBucketName).file(fileName).download({
        destination: `${localRawVideoPath}/${fileName}`,
      });

    // Outputting to the console what happened:
    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
      );
}

/**
 * Purpose:
 * Upload our processed videos back to our google cloud storage bucket
 * 
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {

    // Finding out what bucket our video is being stored in:
    const bucket = storage.bucket(processedVideoBucketName);

    // Check if the bucket is accessible
    const [exists] = await bucket.exists();
    if (!exists) {
        console.error(`Bucket ${processedVideoBucketName} does not exist or is not accessible.`);
        return;
    }
    
    console.log('Attempting to Upload Video to:  ' + processedVideoBucketName);

    // Uploading our video to the bucket 
    // Upload video to the bucket
    
  await storage.bucket(processedVideoBucketName)
  .upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });
console.log(
  `${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
);

    // Set the video to be publicly readable
    await bucket.file(fileName).makePublic();
}



/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
  // Deleting the pre-converted file
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}


/**
* @param fileName - The name of the file to delete from the
* {@link localProcessedVideoPath} folder.
* @returns A promise that resolves when the file has been deleted.
* 
*/
export function deleteProcessedVideo(fileName: string) {
  // Asking GCS to delete the local processed video: 
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}




/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
  // Wrapping our function in a promise:
  // So that we can handle the various behavior it might return:
    return new Promise((resolve, reject) => {
      // Seeing if our file exists:
      if (fs.existsSync(filePath)) 
        {
          // if it does try to delete the file by unlinking (Marking the
          // file as deleted )
        fs.unlink(filePath, (err) => {
          // If we can't send an error 
          if (err) {
            console.error(`Failed to delete file at ${filePath}`, err);
            reject(err);
          } else {
            // If we can log our delete at the file path:
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      }
      else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
  }


  /**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
    console.log(`Directory created at ${dirPath}`);
  }
}