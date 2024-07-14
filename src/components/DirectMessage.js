import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions as needed
import "../styles/DirectMessage.css";

function DirectMessage({ useruid, firestore }) {
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

    return (
        <div className='direct-message-container'>
            {userData && (
                <>
                    <img src={userData.photoURL} alt="User Avatar" />
                    <p>{userData.customUserName}</p>
                </>
            )}
        </div>
    );
}

export default DirectMessage;