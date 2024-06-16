// Importing our main server
import express from "express";

// Importing ffmpeg to handle our video transcoding & encoding
import ffmpeg from 'fluent-ffmpeg';

// Creating an instance of our app
const app = express();
// Defining our parameter type
app.use(express.json());

// Creating a post request so users can post their video:
app.post('/process-video', (req, res) => {
  // Defining our input video location
  const inputFilePath = req.body.inputFilePath;
  // Defining our output video location (the one we are transcoding to create)
  const outputFilePath = req.body.outputFilePath;

  // Checking that our input and output file paths both exist
  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send('Bad Request: Missing file path');
  }

  // Ensure the input and output paths are different
  if (inputFilePath === outputFilePath) {
    return res.status(400).send('Input and output file paths must be different');
  }

  // Since our video location is valid, we can transcode our video by calling
  // ffmpeg with our location and details:
  // Create the ffmpeg command
  ffmpeg(inputFilePath)
    // Defining our video transcode options
    .outputOptions('-vf', 'scale=-1:360') // Video File and 360p
    // On completion we define this function:
    .on('end', function() {
      // If it worked we can tell them that our video posted correctly:
      console.log('Processing finished successfully');
      res.status(200).send('Processing finished successfully');
    })
    // Creating a function to handle our error:
    .on('error', function(err: any) {
      console.log('An error occurred: ' + err.message);
      res.status(500).send('An error occurred: ' + err.message);
    })
    // Saving our output file path
    .save(outputFilePath);
});

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
