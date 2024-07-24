/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import "../styles/Header.css";
import { Link } from "react-router-dom";

import { auth, fetchUserData } from "../backend/backend.js";

function Header({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(user);
      setUserData(data);
    };

    getUserData();
  }, [user]);

  const loadUserProfile = () => {
    return userData ? (
      <div className="header-profile-container">
        <div className="header-img-container">
          <img src={userData.photoURL} alt="User Profile" />
        </div>
        <div className="header-text-container">
          <p>{userData.customUserName}</p>
        </div>
      </div>
    ) : (
      <div className="header-placeholder">
        <div className="header-img-container">
          <div className="header-img-placeholder"></div>
        </div>
        <div className="header-text-container">
          <div className="header-text-placeholder"></div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="header">
        <Link to="/message" className="logo-link">
          <div className="logo">
            <span className="logo-text">chat.</span>
          </div>
        </Link>
        <nav className="nav-links">
          <ul>
            <li>
              <Link to="/message">Messages</Link>
            </li>
          </ul>
        </nav>
        <Link to="/profile">
          <div className="profile">
            {!user ? (
              <SignIn auth={auth} />
            ) : (
              loadUserProfile() // Call the function here
            )}
          </div>
        </Link>
      </header>
    </>
  );
}

export default Header;
