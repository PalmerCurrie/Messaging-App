import "../styles/UserProfile.css";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { useEffect, useState } from "react";
import { fetchUserData, updateDisplayName } from "../backend/backend.js";

function UserProfile({ user, auth, firestore }) {
  const [newName, setNewName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(user);
      setUserData(data);
    };

    getUserData();
  }, [user]);


  const openDisplayNameForm = () => {
    setEditMode(true);
  }

  const handleUpdateDisplayName = () => {
    updateDisplayName(newName, user);
    setEditMode(false);
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
            <SignIn auth={auth} firestore={firestore} />
          </div>
        </div>
      </div>
    );
  }

  // Ensure userData is fetched before rendering
  if (!userData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="img-container">
            <div className="placeholder-img"></div>
          </div>
          <div className="text-container">
            <div className="text-container-placeholder"> </div>
            <div className="text-container-placeholder"> </div>
          </div>
          <div className="button-container">
            <div className="button-placeholder"></div>
            <div className="button-placeholder"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="img-container">
          <img src={userData.photoURL} alt="User Profile" />
        </div>
        <div className="text-container">
          {editMode ? (
            <form onSubmit={handleUpdateDisplayName}>
              <input
                type="text"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              />
              <button type="submit" className="new-name-button">
                Save
              </button>
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
            <button className="edit-button" onClick={openDisplayNameForm}>
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
