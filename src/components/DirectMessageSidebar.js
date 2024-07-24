import "../styles/DirectMessageSidebar.css";
import { useEffect, useState } from "react";
import DirectMessage from "./DirectMessage.js";
import { fetchDirectMessages, addFriend } from "../backend/backend.js";

function DirectMessageSidebar({ user, setRecieverID, recieverID }) {
  const [inputValue, setInputValue] = useState("");

  const handleChatPreviewClick = (id) => {
    setRecieverID(id);
  };

  const handleGlobalClick = () => {
    handleChatPreviewClick("global");
  };

  const [loading, setLoading] = useState(false);
  const [directMessages, setDirectMessages] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const newDirectMessages = await fetchDirectMessages(user);
      setDirectMessages(newDirectMessages);
      setLoading(false);
    };

    getUserData();
  }, [user]);

  if (loading || !directMessages) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  } 


  const handleAddFriend = async () => {
    if (inputValue) {
      await addFriend(inputValue, user)  
      // Update local state
      // need to implement this funciton
      const newDirectMessageNames = await fetchDirectMessages(user);
      setDirectMessages(newDirectMessageNames);
      setInputValue("");
    } 
  };

  const chatPreviewClass =
    recieverID === "global" ? "chat-preview-selected" : "chat-preview";

  return (
    <div className="container">
      <div className="header">
        <h1>Direct Messages</h1>
      </div>
      <div className={chatPreviewClass} id="global" onClick={handleGlobalClick}>
        <h1>Global Chat</h1>
      </div>
      <div className="direct-messages-container">
        {directMessages &&
          directMessages.map((dm) => (
            <DirectMessage
              key={dm}
              useruid={dm}
              handleDivClick={handleChatPreviewClick}
              recieverID={recieverID}
            />
          ))}
      </div>
      <form className="add-user" onSubmit={handleAddFriend}>
        <input
          type="text"
          placeholder="Enter user's email address..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add Friend</button>
      </form>
    </div>
  );
}

export default DirectMessageSidebar;
