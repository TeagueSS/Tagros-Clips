// Importing our main server
import express from "express";

// Importing all of the functions we created in storage.ts for 
// our video processing and handling 
import { 
  uploadProcessedVideo,
  downloadRawVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  convertVideo,
  setupDirectories
} from './storage';
// Create the local directories for videos
setupDirectories();

// Importing ffmpeg to handle our video transcoding & encoding
import ffmpeg from 'fluent-ffmpeg';

// Creating an instance of our app
const app = express();
// Defining our parameter type
app.use(express.json());

// Creating a post request so users can post their video:
app.post('/process-video', async (req, res) => 
  {
  // Get the bucket and filename from the Cloud Pub/Sub message
  // THIS CAN BE FOUND ON THE GOOGLE CLOUD STORAGE DOCUMENTATION FOR NODE.JS
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  // Getting the file name: 
  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Download the raw video from Cloud Storage
  // and we make our function Async so that this can be returned as a promise (Think of it
  // as function insurance to make sure things don't go wrong:)
  await downloadRawVideo(inputFileName);

  // Process the video into 360p
  // We put this function in a try catch as it is possible that this function fails:
  try { 
    // Try to convert the video 
    await convertVideo(inputFileName, outputFileName)
  } catch (err) {
    // If it fails ->
    await Promise.all(
      //Here we define an array of pomisses we need to complete: 
      [
      // Delete the raw video and the processed video 
      // as the video is probaby being stored somewhere sense that processing failed 
      // and as such we need to delete that "In Progress" try 
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);
    // then send a failure status:
    return res.status(500).send('Processing failed');
  }
  
  // Upload the processed video to Cloud Storage
  await uploadProcessedVideo(outputFileName);
  // If it went well then we still need to delete the "Mid Process" video
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);
  // Then we can tell the user that the data has been processed: 
  return res.status(200).send('Processing finished successfully');
  }

);

// Defining the port (Web Address) where we can access our site locally
const port = process.env.PORT || 3000;
// Routing our root requests:
// app.get("/", (req , res) => {
// // Where all of our routing requests go:
// // and what we are going to return
// res.send("Hello World!");
// });

// Starting our server:
app.listen(port, () => {
  // Sending a console log
  console.log('Listening at http://localhost:' + port);
});
