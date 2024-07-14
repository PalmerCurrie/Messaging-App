import "../styles/UserProfile.css"
import SignIn from "./SignIn";
import SignOut from "./SignOut";

function UserProfile( {user, auth, firestore} ) {

    


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

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="img-container">
                    <img src={user.photoURL} alt="User Profile"/>
                </div>
                <div className="text-container">
                    <h1>{user.displayName}</h1>
                    <p>{user.email}</p>
                </div>
                <div className="button-container">
                    <button className="edit-button">Edit Display Name</button>
                    <SignOut auth={auth}/>
                </div>

            </div>

        </div>
      );
}

export default UserProfile;