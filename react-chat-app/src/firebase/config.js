import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
var firebaseConfig = {
  apiKey: "AIzaSyAAMOAoSPO0Y0EXIYWHXkSWFLKS6PCTGEs",
  authDomain: "my-chat-app-dd479.firebaseapp.com",
  projectId: "my-chat-app-dd479",
  storageBucket: "my-chat-app-dd479.appspot.com",
  messagingSenderId: "21148173535",
  appId: "1:21148173535:web:7899a0050bf3026e3fd56a",
  measurementId: "G-DGD2C0EGL0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();
const deleteObject  = firebase.storage();
const ref = firebase.storage();


export { db, auth, storageRef, storage, deleteObject,ref  };
export default firebase;
