import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyBnTOHPQG2CYBOWtLhkH1g6oE897AXpq8I",
  authDomain: "weather-app-428ea.firebaseapp.com",
  projectId: "weather-app-428ea",
  storageBucket: "weather-app-428ea.appspot.com",
  messagingSenderId: "247999625485",
  appId: "1:247999625485:web:12109e95c7d8489e601844"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db