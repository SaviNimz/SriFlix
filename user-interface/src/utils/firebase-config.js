// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCcunRlNx2XloqNqYy1XpPAX6SK7elMkEI",
  authDomain: "sriflix-f8183.firebaseapp.com",
  projectId: "sriflix-f8183",
  storageBucket: "sriflix-f8183.appspot.com",
  messagingSenderId: "801666353480",
  appId: "1:801666353480:web:ad768c111517e155d98b7d",
  measurementId: "G-79TM9HE4H9"
};


const app = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);