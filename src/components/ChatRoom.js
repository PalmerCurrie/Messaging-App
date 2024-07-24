/* eslint-disable react-hooks/exhaustive-deps */
import ChatMessage from "./ChatMessage.js";
import DirectMessageSidebar from "./DirectMessageSidebar.js";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/ChatRoom.css";
import { getDirectMessageID, 
         getGlobalMessages, 
         getDirectMessages, 
         fetchUserData, 
         fetchChatName, 
         sendDirectMessage,
         sendMessage,
         deleteMessage,
      } from "../backend/backend.js";
import { serverTimestamp } from "firebase/firestore";


function ChatRoom({ user, recieverID, setRecieverID }) {
  // Reference the Firestore collection
  const [messages, setMessages] = useState(null);
  const messagesContainerRef = useRef(null); // Used to scroll down messages div on message send.
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
    
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    const getUserMessages = async () => {
      if (recieverID === "global") {
        setLoading(true);
        const newMessages = await getGlobalMessages();
        setMessages(newMessages);
      } else {
        setLoading(true);
        const dmID = getDirectMessageID(user.uid, recieverID);
        const newDirectMessages = await getDirectMessages(dmID);
        setMessages(newDirectMessages);
      }
      setLoading(false);
    }
    const getOtherData = async () => {
      setLoading(true);
      const data = await fetchUserData(user);
      setUserData(data);
      const newChatName = await fetchChatName(recieverID);
      setChatName(newChatName);
      setLoading(false);
    };

    getOtherData();
    getUserMessages();
  }, [ user, recieverID ]);

  const handleSendNewMessage = async () => {
    const uniqueID = uuidv4();
    const messageObject = {
      id: uniqueID,
      text: formValue,
      createdAt: serverTimestamp(),
      photoURL: user.photoURL,
      displayName: user.displayName,
      customUserName: userData.customUserName,
      senderID: user.uid,
      recieverID,
    }


    if (recieverID === "global") {
      await sendMessage(messageObject);
    } else {
      // await sendDirectMessage(messageObject, directMessageID);
    }
    setFormValue("");
    scrollToBottom();
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Handling deleting a message
  const handleDeleteMessage = async (collectionName, messageID) => {
    deleteMessage(collectionName, messageID);
  };

  // Outline for page Loading
  if (loading || !userData) {
    return (
      <div className="wrapper">
        <div className="left-div"></div>
        <div className="centered-div">
          <div className="chatroom-container">
            <div className="chatroom-header-loading">
              <h2> Loading... </h2>
            </div>
          </div>
        </div>
        <div className="right-div"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <p>Please Sign In in the Profile Section</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="left-div">
        <DirectMessageSidebar
          user={user}
          setRecieverID={setRecieverID}
          recieverID={recieverID}
        />
      </div>
      <div className="centered-div">
        <div className="chatroom-container" ref={messagesContainerRef}>
          <div className="chatroom-header">
            <h2>{chatName === "global" ? "Global" : chatName}</h2>
            {/* Add any additional elements for the header/bar here */}
          </div>
          <div className="messages">
            {messages &&
              messages
                .slice()
                .reverse()
                .map((msg) => {
                  if (recieverID === "global" && msg.recieverID === "global") {
                    return (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        sender={msg.senderID === user.uid}
                        currentUser={user}
                        isGlobal={true}
                        handleDeleteMessage={handleDeleteMessage}
                      />
                    );
                  } else if (
                    (msg.senderID === user.uid &&
                      msg.recieverID === recieverID) ||
                    (msg.senderID === recieverID && msg.recieverID === user.uid)
                  ) {
                    return (
                      <ChatMessage
                        key={msg.id}
                        message={msg}
                        currentUser={user}
                        sender={msg.senderID === user.uid}
                        isGlobal={false}
                        handleDeleteMessage={handleDeleteMessage}
                      />
                    );
                  }
                  return null;
                })}
          </div>

          <form onSubmit={handleSendNewMessage} className="message-form">
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
      <div className="right-div"></div>
    </div>
  );
}

export default ChatRoom;
