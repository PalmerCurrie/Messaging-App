/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import SignIn from "./SignIn";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import FriendRequest from "./FriendRequest.js";

import { auth, fetchUserData } from "../backend/backend.js";

function Header({ user, refresh, setRefresh }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(user);
      setUserData(data);
    };

    getUserData();
  }, [user, refresh]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotificationDropdownOpen]);

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
              {userData?.friendRequests.map((friend, index) => (
                <FriendRequest
                  user={user}
                  setRefresh={setRefresh}
                  index={index}
                  friendID={friend}
                />
              ))}
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
        {!user ? <p> </p> : loadNotifications()}

        <Link to="/profile">
          <div className="profile">
            {!user ? <SignIn auth={auth} /> : loadUserProfile()}
          </div>
        </Link>
      </header>
    </>
  );
}

export default Header;
