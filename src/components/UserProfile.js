import "../styles/UserProfile.css"
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";

function UserProfile( {user, auth, firestore} ) {
    const [newName, setNewName] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        if (user) {
          const userDocRef = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('User document does not exist');
          }
        }
      };
  
      fetchUserData();
    }, [user, firestore]);
  

    const handleUpdateDisplayName = () => {
        setEditMode(true);
    }
    const updateDisplayName = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);
    
            if (userSnap.exists()) {
                // Document exists, proceed with update
                await updateDoc(userRef, {
                    customUserName: newName
                });
                userData.customUserName = newName;
                setEditMode(false);
            } else {
                console.error('Document does not exist');
            }
        } catch (error) {
            console.error('Error updating display name:', error);
        }
    }


    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <div className="img-container">
                        <div className="placeholder-img"></div>
                    </div>
                    <div className="text-container">
                        <h1>Please Sign In</h1>
                    </div>
                    <div className="button-container">
                        <SignIn auth={auth} firestore={firestore}/>
                    </div>
                </div>
            </div>
        )
    }

    // Ensure userData is fetched before rendering
    if (!userData) {
      return <div>Loading...</div>;
    }
  

    return (
        <div className="profile-page">
          <div className="profile-container">
            <div className="img-container">
              <img src={userData.photoURL} alt="User Profile" />
            </div>
            <div className="text-container">
                    {editMode ? (
                        <form onSubmit={updateDisplayName}>
                            <input type="text" onChange={(e) => setNewName(e.target.value)} value={newName} />
                            <button type="submit" className="new-name-button">Save</button>
                        </form>
                    ) : (
                        <>
                            <h1>{userData.customUserName}</h1>
                            <p>{userData.email}</p>
                        </>
                    )}
            </div>
            <div className="button-container">
              {!editMode && (
                <button className="edit-button" onClick={handleUpdateDisplayName}>
                  Edit Display Name
                </button>
              )}
              <SignOut auth={auth} />
            </div>
          </div>
        </div>
      );
}

export default UserProfile;