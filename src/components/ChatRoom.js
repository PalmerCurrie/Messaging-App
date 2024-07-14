import ChatMessage from './ChatMessage.js'
import { useRef, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, serverTimestamp, addDoc  } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import "../styles/ChatRoom.css";
import DirectMessageSidebar from './DirectMessageSidebar.js';


function ChatRoom( {user, firestore, recieverID, setRecieverID} ) {
  // When user adds a new message to chat, it creates a document in the database collection
    
  // Reference the Firestore collection
  const messagesRef = collection(firestore, 'messages');

  // Query documents in the collection
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  // Listen to data with a hook
  const [messages, error] = useCollectionData(q, { idField: 'id' });

  const scrollDown = useRef(); // Scrolls down to bottom of messages each time message sent

  const [formValue, setFormValue] = useState("");


  // Fetch userData for customUserName
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
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
        setLoading(false); // Set loading to false even if there's no user
      }
    };
    fetchUserData();
  }, [user]);

    




    const sendMessage = async(e) => {
        e.preventDefault(); // Stop page form refreshing when form is submit

        const {uid, photoURL, displayName} = user


        // Create new document in 'messages' database, takes JavaScript object as argument
        if (formValue !== "") {
            console.log(userData.customUserName);
            try {
                await addDoc(messagesRef, {
                    text: formValue,
                    createdAt: serverTimestamp(),
                    uid,
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
                    <h2>Chat Room</h2>
                    {/* Add any additional elements for the header/bar here */}
                </div>
                <div className='messages'>
                    {messages && messages.map(msg => (
                        <ChatMessage key={msg.id} message={msg} currentUser={user} />
                    ))}
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