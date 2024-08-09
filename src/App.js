import React, { useEffect, useState } from "react";
import ChatRoom from "./components/ChatRoom.js";
import Header from "./components/Header.js";
import UserProfile from "./components/UserProfile.js";
import HomePage from "./components/HomePage.js";
import { ThemeProvider } from "./components/ThemeProvider.js";
import "./App.css";

import { useAuthState } from "react-firebase-hooks/auth";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { auth, checkIfUserExists } from "./backend/backend.js";

function App() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    checkIfUserExists(user);
  }, [user]);

  // For DirectMessaging and settingRecieverId
  const [recieverID, setRecieverID] = useState("global");

  useEffect(() => {
    setRecieverID("global");
  }, []);

  const [refresh, setRefresh] = useState(false);

  return (
    <ThemeProvider>
      <Router>
        <Header user={user} refresh={refresh} setRefresh={setRefresh} />
        <Routes>
          <Route path="/profile" element={<UserProfile user={user} />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/message"
            element={
              <ChatRoom
                user={user}
                // userID={user.uid}
                setRecieverID={setRecieverID}
                recieverID={recieverID}
                refresh={refresh}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
