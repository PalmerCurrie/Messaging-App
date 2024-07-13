import React from 'react';
import './App.css';
import SignIn from './components/SignIn.js';
import SignOut from './components/SignOut.js';
import ChatRoom from "./components/ChatRoom.js";

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';



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

  return (
    <div className="App">

      <div className='page'>
        {user ? <ChatRoom user={user} firestore={firestore} /> : <SignIn auth={auth} />}
      </div>
    </div>
  );
}



export default App;
