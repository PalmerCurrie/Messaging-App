import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions as needed
import "../styles/DirectMessage.css";

function DirectMessage({ useruid, firestore, handleDivClick, recieverID }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        if (useruid) {
          const userDocRef = doc(firestore, 'users', useruid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('User document does not exist');
          }
        }
      };
  
      fetchUserData();
    }, [useruid]);

    const handleClick = () => {
        handleDivClick(useruid);
    }

    return (
        <div className={`direct-message-container ${useruid === recieverID ? 'selected' : ''}`} onClick={handleClick}>
            {userData ? (
                <>
                <div >
                    <img src={userData.photoURL} alt="User Avatar" />
                </div>
                    <div>
                      <h1>{userData.customUserName}</h1>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default DirectMessage;