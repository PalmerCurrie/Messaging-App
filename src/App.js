import React, { useEffect, useState } from 'react';
import './App.css';
import SignIn from './components/SignIn.js';
import SignOut from './components/SignOut.js';
import ChatRoom from "./components/ChatRoom.js";
import Header from './components/Header.js';
import UserProfile from './components/UserProfile.js';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';

import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { doc, setDoc } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyA8vNUAKgWZAg5h4S0IruOe6DvjE2rYUwc",
  authDomain: "messaging-app-f254c.firebaseapp.com",
  projectId: "messaging-app-f254c",
  storageBucket: "messaging-app-f254c.appspot.com",
  messagingSenderId: "298980020951",
  appId: "1:298980020951:web:5c237d7e0385d56dd69692",
  measurementId: "G-V6CE7T8Y4P"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);



function App() {

  const [user] = useAuthState(auth);


  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const usersRef = collection(firestore, 'users');

    const addUserToFirestore = async (userData) => {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          createdAt: serverTimestamp(),
          customUserName: user.displayName,
        })
        console.log('User added to Firestore with ID: ', userData.uid);
      } catch (error) {
        console.error('Error adding user to Firestore: ', error);
      }
    };

    if (user) {
      setCurrentUser(user);

      // Check if user already exists in Firestore
      const userQuery = query(usersRef, where('uid', '==', user.uid));
      getDocs(userQuery).then((querySnapshot) => {
        if (querySnapshot.empty) {
          addUserToFirestore(user);
        } else {
          console.log('User already exists in Firestore');
        }
      }).catch((error) => {
        console.error('Error checking user existence: ', error);
      });
    }
  }, [user]);


  

  return (
    <Router>
    <div className="App">
      <Header />
      <Routes>
        <Route path="/profile" element={<UserProfile user={user} auth={auth} firestore={firestore} />} />
        <Route path="/message" element={<ChatRoom user={user} firestore={firestore} />} />
      </Routes>
    </div>
  </Router>
  );
}



export default App;
