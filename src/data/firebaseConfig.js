import { initializeApp } from 'firebase/app';
import { getFirestore,collection, addDoc, GeoPoint } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsjRPHe2AhGpRhVGt-NWOG0blXkOt0HwI",
  authDomain: "climetapipe.firebaseapp.com",
  databaseURL: "https://climetapipe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "climetapipe",
  storageBucket: "climetapipe.appspot.com",
  messagingSenderId: "307910444889",
  appId: "1:307910444889:web:e4dabdb09f92313b84ae48",
  measurementId: "G-92DGS1EBSQ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };