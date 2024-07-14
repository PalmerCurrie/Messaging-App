import "../styles/DirectMessageSidebar.css";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs} from "firebase/firestore";
import DirectMessage from "./DirectMessage.js";


function DirectMessageSidebar( {user, setRecieverID, firestore} ) {

    // Need to make a users collection first

    // useState of recieverId that is set to "global" on default
    // when i click on a user in my DirectMessages the onclick of the div
    // sets the recieverID to be that users ID.
    // I have a add dm user or friend form that adds another user to the DM list
    
    const [inputValue, setInputValue] = useState("");

    const handleChatPreviewClick = (e) => {
      const divId = e.currentTarget.id;
      console.log("Clicked on Div with ID: ", divId);
      // setRecieverID(divId);
    }

    const [loading, setLoading] = useState(false);
    const [directMessages, setDirectMessages] = useState([]);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
      const fetchUserData = async () => {
        if (user) {
          try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
              setDirectMessages(data.directMessages || []);
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
    }, [user, firestore]);


    if (loading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      )
    }



    const handleAddFriend = async (e) => {
      e.preventDefault();
      // Add logic to find the user by email and update directMessages
      if (inputValue) {
        try {

          const usersCollection = collection(firestore, 'users'); // Accessing collection from Firestore instance
          const querySnapshot = await getDocs(query(usersCollection, where('email', '==', inputValue)));

          if (!querySnapshot.empty) {
            const friendData = querySnapshot.docs[0].data();
            const friendId = querySnapshot.docs[0].id;

          // Check if friendId is already in directMessages
          if (directMessages.includes(friendId)) {
            console.log('Friend is already added.');
            setInputValue('');
            return; // Exit function if friend is already added
          }
    
            // Update directMessages for the current user
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
              directMessages: arrayUnion(friendId)
            });
    
            // Update local state
            setDirectMessages(prevMessages => [...prevMessages, friendId]);
            setInputValue('');
          } else {
            console.log('No user found with that email');
          }
        } catch (error) {
          console.error('Error adding friend:', error);
        }
      }
    };
  
  return (
    <div className='container'>
      <h1>Direct Messages</h1>
      <div className="chat-preview" id="global" onClick={handleChatPreviewClick}>
        <p>Global Chat</p>
      </div>
      <div className="direct-messages-container">
        {directMessages && directMessages.map(dm => (
          <DirectMessage key={dm} useruid={dm} firestore={firestore}/>
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