import ChatMessage from './ChatMessage.js'
import { useRef, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, serverTimestamp, addDoc  } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import "../styles/ChatRoom.css";
import DirectMessageSidebar from './DirectMessageSidebar.js';


function ChatRoom( {user, firestore, recieverID, setRecieverID } ) {
  // When user adds a new message to chat, it creates a document in the database collection
    
  // Reference the Firestore collection
  const messagesRef = collection(firestore, 'messages');

  // Query documents in the collection
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  // Listen to data with a hook
  const [messages, error] = useCollectionData(q, { idField: 'id' });

  const scrollDown = useRef(); // Scrolls down to bottom of messages each time message sent

  const [formValue, setFormValue] = useState("");


  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const [chatName, setChatName] = useState("");
  const fetchChatName = async () => {
    if (recieverID == "global") {
        setChatName("global");
        return;
    } 
    if (user) {
        try {
          const userDocRef = doc(firestore, 'users', recieverID);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setChatName(docSnap.data().customUserName);
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } 
      } 
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
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


    




    const sendMessage = async(e) => {
        e.preventDefault(); // Stop page form refreshing when form is submit

        const {uid, photoURL, displayName} = user


        // Create new document in 'messages' database, takes JavaScript object as argument
        if (formValue !== "") {
            try {
                await addDoc(messagesRef, {
                    text: formValue,
                    createdAt: serverTimestamp(),
                    photoURL,
                    displayName,
                    customUserName: userData.customUserName,
                    senderID: user.uid,
                    recieverID,
                });

                setFormValue('');

                scrollDown.current.scrollIntoView( { behavior: 'smooth' } );
            } catch (error) {
                console.error('Error adding message: ', error);
            }
        }
    } 

    if (loading || error || !userData) {
        return <p>Loading messages...</p>;
    }

    if (!user) {
        return (
            <div>
                <p>Please Sign In in the Profile Section</p>
            </div>
        )
    }


    return (
    <div className='wrapper'>
        <div className='left-div'>
            <DirectMessageSidebar 
                user={user} 
                setRecieverID={setRecieverID} 
                firestore={firestore}
                recieverID={recieverID}/>
        </div>
        <div className='centered-div'>
            <div className='chatroom-container'>
                <div className='chatroom-header'>
                    <h2>{chatName}</h2>
                    {/* Add any additional elements for the header/bar here */}
                </div>
                <div className='messages'>
                    {messages && messages.map(msg => {
                        if (recieverID === 'global') {
                            // Display all messages when recieverID is 'global'
                            const globalCase = msg.recieverID === "global";
                            if (globalCase) {
                                return <ChatMessage key={msg.id} message={msg} currentUser={user} isGlobal={true} />;
                            }
                        } else {
                            // Check if the message matches either of the direct messaging cases
                            const case1 = msg.senderID === user.uid && msg.recieverID === recieverID;
                            const case2 = msg.senderID === recieverID && msg.recieverID === user.uid;
                            if (case1 || case2) {
                                return <ChatMessage key={msg.id} message={msg} currentUser={user} sender={msg.senderID == user.uid} isGlobal={false} />;
                            } else {
                                return null;
                            }
                        }
                    })}
                    <div ref={scrollDown}></div>
                </div>

                <form onSubmit={sendMessage} className='message-form'>

                    <input 
                        type="text" 
                        value={formValue} 
                        onChange={(e) => setFormValue(e.target.value)} 
                        placeholder='Type your message...'/>
                    <button type="submit">Send</button>

                </form>
            </div>
        </div>
        <div className='right-div'></div>
    </div>
    )
}

export default ChatRoom;