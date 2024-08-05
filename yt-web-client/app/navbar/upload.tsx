'use client';

import { Fragment } from "react";
import { uploadVideo } from "../firebase/functions";

import styles from "./upload.module.css";

// Creating the functionality for our upload button:
export default function Upload() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Selecting the file we wish to work with 
    const file = event.target.files?.item(0);
    // If our file exists correctly pass it to our handle upload function:
    if (file) {
      handleUpload(file);
    }
  };

  // Handles taking in the file and actually processing the upload 
  // Making this Async so we make sure the file can be uploaded 
  // correctly: 
  const handleUpload = async (file: File) => {
    try {
      const response = await uploadVideo(file);
      alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    // Here we use fragment as it allows us to return and wrap around 
    // multiple objects: 
    <Fragment>
      <input id="upload" className={styles.uploadInput} type="file" accept="video/*" 
      onChange={handleFileChange} />

      <label htmlFor="upload" className={styles.uploadButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </label>
    </Fragment>
  );
}
