import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAlz2Xm93DhzOWmHW_-B-yFcJGo60pKnSo",
  authDomain: "virtual-classroom-8a746.firebaseapp.com",
  projectId: "virtual-classroom-8a746",
  storageBucket: "virtual-classroom-8a746.appspot.com",
  messagingSenderId: "526722323208",
  appId: "1:526722323208:web:883e22289223698dcbd2bd",
  measurementId: "G-HV3HY9SX4K"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
var storage = app.storage();

const signInWithGoogle = async () => {
  try {
    const response = await auth.signInWithPopup(googleProvider);
    console.log(response.user);
    const user = response.user;
    console.log(`User ID - ${user.uid}`);
    const querySnapshot = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (querySnapshot.docs.length === 0) {
      // create a new user
      await db.collection("users").add({
        uid: user.uid,
        enrolledClassrooms: [],
      });
    }
  } catch (err) {
    alert(err.message);
  }
};
const logout = () => {
  auth.signOut();
};

export { app, storage, auth, db, signInWithGoogle, logout };
