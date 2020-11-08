import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3Q_YaQc0IXhDod0M_GoeDcLqw0tub4T8",
  authDomain: "user-details-fd178.firebaseapp.com",
  databaseURL: "https://user-details-fd178.firebaseio.com",
  projectId: "user-details-fd178",
  storageBucket: "user-details-fd178.appspot.com",
  messagingSenderId: "766773760465",
  appId: "1:766773760465:web:588c06b8bf30f595dd90f0",
  measurementId: "G-VHLR5ST2JN",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export default db;
