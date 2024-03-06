import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDMD1yhzV9rE00B55W7_Q1GqQ9-xPXvtds",
    authDomain: "salebooksstorage.firebaseapp.com",
    projectId: "salebooksstorage",
    storageBucket: "salebooksstorage.appspot.com",
    messagingSenderId: "919093636145",
    appId: "1:919093636145:web:9447c1c54ddbbb81113910",
    measurementId: "G-BWXSJ9ZKR3"
  };

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)