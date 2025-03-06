// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { IContatctUsForm } from "./interfaces";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVLnu1OzYXu15_iwY9VzCQHV0octPBT9g",
  authDomain: "sufweb-8aac3.firebaseapp.com",
  databaseURL: "https://sufweb-8aac3-default-rtdb.firebaseio.com",
  projectId: "sufweb-8aac3",
  storageBucket: "sufweb-8aac3.appspot.com",
  messagingSenderId: "945224388094",
  appId: "1:945224388094:web:b06249c1490addc5ac04af",
  measurementId: "G-9RRNY6GH4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);



//sending data to firebase
export async function sendMessage(formData: IContatctUsForm) {
  try {
    const docRef = await addDoc(collection(db, "contacts"), {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
      return true
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
      // console.error("Error adding document: ", e);
      return false
  }
}
