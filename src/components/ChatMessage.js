import "../styles/ChatMessage.css";
import React, { useState, useRef, useEffect } from "react";

function ChatMessage({
  key,
  message,
  currentUser,
  sender,
  isGlobal,
  handleDeleteMessage,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const popupRef = useRef(null);

  const { uid, text, photoURL, createdAt, displayName, customUserName } = message;

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!message || !message.createdAt) {
    return null; // Return null or handle the case where message or createdAt is missing
  }

  // Calculate the date from Firestore Timestamp
  const date = new Date(
    createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
  );

  // Function to format date
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Format date into MM/DD/YYYY h:mm A format
  const formattedDate = formatDate(date);

  // Determine the message class based on sender
  let messageClass = false;
  if (isGlobal) {
    messageClass = message.senderID === currentUser.uid ? "sent" : "received";
  } else {
    messageClass = sender ? "sent" : "received";
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const deleteMessage = () => {
    if (message.id) {
      handleDeleteMessage(message.id);
    } else {
      console.log("No message found with id: ", message.id);
    }
  };

  return (
    <div className={`message ${messageClass}`} key={key}>
      <div className="message-content">
        {messageClass === "received" && (
          <img src={photoURL} alt="User avatar" className="avatar" />
        )}
        <div className="message-text">
          {messageClass === "received" && (
            <p className="username">{customUserName || displayName}</p>
          )}
          <p>{text}</p>
          <p className="timestamp">{formattedDate}</p>
        </div>
      </div>
      <div className="menu-container">
        <div className="popup-open" onClick={handleMenuToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-up"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </div>
        {isMenuOpen && (
          <div className="popup-menu" ref={popupRef}>
            <div className="popup-menu-item" onClick={deleteMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="red"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
