import { useState, useEffect } from "react";
import "../styles/DirectMessage.css";
import { fetchUserData } from "../backend/backend";

function DirectMessage({ user, useruid, handleDivClick, recieverID }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData(user);
      setUserData(data);
    };

    getUserData();
  }, [user, useruid]);

  const handleClick = () => {
    handleDivClick(useruid);
  };

  return (
    <div
      className={`direct-message-container ${
        useruid === recieverID ? "selected" : ""
      }`}
      onClick={handleClick}
    >
      {userData ? (
        <>
          <div>
            <img src={userData.photoURL} alt="User Avatar" />
          </div>
          <div>
            <h1>{userData.customUserName}</h1>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="img-placeholder"></div>
          </div>
          <div>
            <div className="text-placeholder"></div>
          </div>
        </>
      )}
    </div>
  );
}

export default DirectMessage;
