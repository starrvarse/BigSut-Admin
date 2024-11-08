if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyB5Pa74hnjLMw2EpQXhy6DGLzdMI3fNd0U",
    authDomain: "bigsur010100.firebaseapp.com",
    projectId: "bigsur010100",
    storageBucket: "bigsur010100.appspot.com",
    messagingSenderId: "502874443980",
    appId: "1:502874443980:web:5efd1c1eb8b70a87073269",
    measurementId: "G-44BF2S7JM7"
  };

  try {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Initialize Firestore
    const db = firebase.firestore();
  } catch (error) {
    console.error("Error initializing Firebase or Firestore: ", error);
  }
} else {
  firebase.app(); // If already initialized, use that one
}
