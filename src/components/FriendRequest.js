import React, { useEffect, useState } from "react";
import "../styles/Header.css";

import {
  acceptFriendRequest,
  ignoreFriendRequest,
  getChatName,
} from "../backend/backend.js";

function FriendRequest({ user, setRefresh, index, friendID }) {
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    const fetchChatName = async () => {
      const name = await getChatName(friendID);
      setChatName(name);
    };

    fetchChatName();
  }, [friendID]);

  const updateRefresh = () => {
    setRefresh((prevState) => !prevState);
  };

  const handleAddFriend = async (friendID) => {
    console.log("Added friend:", friendID);
    await acceptFriendRequest(friendID, user);
    updateRefresh();
  };

  const handleIgnoreFriend = async (friendID) => {
    console.log("Ignored friend:", friendID);
    await ignoreFriendRequest(friendID, user);
    updateRefresh();
  };

  return (
    <div className="friend-request-container">
      <li key={index}> {chatName ? chatName : "..."} </li>
      <button
        onClick={() => {
          handleAddFriend(friendID);
        }}
      >
        Add
      </button>
      <button
        className="ignore"
        onClick={() => {
          handleIgnoreFriend(friendID);
        }}
      >
        Ignore
      </button>
    </div>
  );
}

export default FriendRequest;
