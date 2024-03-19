import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref as firebaseStorageRef, uploadBytes, getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { nanoid } from 'nanoid';
import { styled } from '@mui/system';
import { API_BASE_URL } from '../../config';

// Ensure you have initialized Firebase and obtained the storage reference

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Initialize the Firebase app outside the component
const firebaseConfig = {
  apiKey: "AIzaSyCJXKGsIDf9DolOn1FYct9HdzYbuSlxnuU",
  authDomain: "salebooks-34cc5.firebaseapp.com",
  projectId: "salebooks-34cc5",
  storageBucket: "salebooks-34cc5.appspot.com",
  messagingSenderId: "988830933149",
  appId: "1:988830933149:web:e1db3213fa1cab9014b474",
  measurementId: "G-ML9LKSBLTV"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function FirebaseImageUpload() {
  const [imageDb, setImageDb] = useState(storage);

  useEffect(() => {
    const getImageDb = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/api/FirebaseConfig/config`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          // Don't reinitialize the app here
          setImageDb(getStorage(app, data.storageBucket));
        } else {
          console.log('Token no:', localStorage.getItem('jwttoken'));
        }
      } catch (error) {
        console.error('Error fetching image db:', error.message);
      }
    };
    getImageDb();
  }, [setImageDb]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log(imageDb);

    // Check if imageDb is not null or undefined and contains necessary properties
    if (imageDb && imageDb.storageBucket) {
      const storageRef = firebaseStorageRef(imageDb, `images/${nanoid()}`);

      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Now you can use the downloadURL as needed
        console.log('Image uploaded successfully. Download URL:', downloadURL);

        // You might want to update the user's profile with the image URL
        // For example, make a POST request to your server to update the user's profile with the downloadURL
        // You can use the 'imageDb' state to get user information and update the profile accordingly
      } catch (error) {
        console.error('Error uploading image:', error.message);
      }
    } else {
      console.error('imageDb is null or undefined or missing necessary properties.');
    }
  };

  return (
    <div>
      <label htmlFor="imageInput"> 
        <span>Upload Image</span>
      </label>
      <VisuallyHiddenInput
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default FirebaseImageUpload;
