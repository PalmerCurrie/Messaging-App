/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
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

  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => {
    setIsNotificationDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (
      isNotificationDropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsNotificationDropdownOpen(false);
    }
  };

  // For handling clicks outside of notification dropdown menu
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isNotificationDropdownOpen]);

  const handleAddFriend = (friend) => {
    console.log("Added friend:", friend);
  };

  const handleIgnoreFriend = (friend) => {
    console.log("Ignored friend:", friend);
  };

  const friendRequestElement = (index, friend) => {
    return (
      <div className="friend-request-container">
        <li key={index}>{friend}</li>
        <button
          onClick={() => {
            handleAddFriend(friend);
          }}
        >
          Add
        </button>
        <button
          onClick={() => {
            handleIgnoreFriend(friend);
          }}
        >
          Ignore
        </button>
      </div>
    );
  };

  const loadNotifications = () => {
    if (!userData) {
      return null;
    }
    return (
      <div
        className="notification-container"
        onClick={(e) => {
          e.stopPropagation();
          handleToggleDropdown();
        }}
      >
        <p>Notifications: {userData.friendRequests.length}</p>
        {isNotificationDropdownOpen && (
          <div
            ref={dropdownRef}
            className="notification-dropdown-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Friend Requests: </h1>
            <ul>
              {userData?.friendRequests.map((friend, index) =>
                friendRequestElement(index, friend)
              )}
            </ul>
          </div>
        )}
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
        {!user ? (
          <p> </p>
        ) : (
          // <div></div>
          loadNotifications() // Call the function here
        )}

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
