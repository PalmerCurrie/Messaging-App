import ChatMessage from './ChatMessage.js'
import { useRef, useState } from 'react';
import { collection, query, orderBy, limit, serverTimestamp, addDoc  } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';


function ChatRoom( {user, firestore } ) {
    // When user adds a new message to chat, it creates a document in the database collection
    
  // Reference the Firestore collection
  const messagesRef = collection(firestore, 'messages');

  // Query documents in the collection
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  // Listen to data with a hook
  const [messages, loading, error] = useCollectionData(q, { idField: 'id' });
    // Returns an array of objects, where each object is the message in the database
    // anytime data changes, react will re-render with the latest data   

    const scrollDown = useRef();

    const [formValue, setFormValue] = useState("");

    const sendMessage = async(e) => {
        e.preventDefault(); // Stop page form refreshing when form is submit

        const { uid, photoURL } = user;

        // Create new document in 'messages' database
        // takes JavaScript object as argument
        try {
            await addDoc(messagesRef, {
                text: formValue,
                createdAt: serverTimestamp(),
                uid,
                photoURL
            });

            setFormValue('');

            scrollDown.current.scrollIntoView( { behavior: 'smooth' } );
        } catch (error) {
            console.error('Error adding message: ', error);
        }
    } 

    if (loading) {
        return <p>Loading messages...</p>;
    }
    
    if (error) {
        console.error('Error fetching messages:', error);
        return <p>Error loading messages.</p>;
    }



    return (
      <div className='chatroom-container'>
        <main>
            {messages && messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} currentUser={user} />
            ))}
            <div ref={scrollDown}></div>
        </main>

        <form onSubmit={sendMessage}>

            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
            <button type="submit"> Send Message </button>


        </form>
      </div>
    )
}

export default ChatRoom;