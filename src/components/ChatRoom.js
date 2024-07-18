/* eslint-disable react-hooks/exhaustive-deps */
import ChatMessage from "./ChatMessage.js";
import DirectMessageSidebar from "./DirectMessageSidebar.js";
import { useRef, useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  deleteDoc,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { v4 as uuidv4 } from "uuid";
import "../styles/ChatRoom.css";

function ChatRoom({ user, firestore, recieverID, setRecieverID }) {
  // Reference the Firestore collection
  const messagesRef = collection(firestore, "messages");

  // Query documents in the collection
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(25));

  // Listen to data with a hook
  const [messages, error] = useCollectionData(q, { idField: "id" });

  const messagesContainerRef = useRef(null); // Used to scroll down messages div on message send.
  const [formValue, setFormValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [chatName, setChatName] = useState("");
  const fetchChatName = async () => {
    if (recieverID === "global") {
      setChatName("global");
      return;
    }
    if (user) {
      try {
        const userDocRef = doc(firestore, "users", recieverID);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setChatName(docSnap.data().customUserName);
        } else {
          console.log("User document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
    fetchChatName();
  }, [user, recieverID]);

  const sendMessage = async (e) => {
    e.preventDefault(); // Stop page form refreshing when form is submit

    const { photoURL, displayName } = user;
    const uniqueId = uuidv4(); // Generate a unique ID for the message

    // Create new document in 'messages' database, takes JavaScript object as argument
    if (formValue !== "") {
      try {
        await addDoc(messagesRef, {
          id: uniqueId,
          text: formValue,
          createdAt: serverTimestamp(),
          photoURL,
          displayName,
          customUserName: userData.customUserName,
          senderID: user.uid,
          recieverID,
        });

        setFormValue("");
        scrollToBottom();
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Handling deleting a message
  const handleDeleteMessage = async (messageID) => {
    try {
      // Create a query against the collection
      const q = query(
        collection(firestore, "messages"),
        where("id", "==", messageID)
      );

      // Get the documents matching the query
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (document) => {
        await deleteDoc(document.ref);
        console.log(`Document with ID ${document.id} successfully deleted!`);
      });

      if (querySnapshot.empty) {
        console.log("No document found with ID: ", messageID);
      }
    } catch (error) {
      console.log("Error removing document: ", error);
    }
  };

  // Outline for page Loading
  if (loading || error || !userData) {
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
          firestore={firestore}
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

          <form onSubmit={sendMessage} className="message-form">
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
