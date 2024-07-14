import "../styles/UserProfile.css"

function UserProfile( {user} ) {

    // user.displayName
    // user.email
    // user.photoURL
    // user.uid
    // 

    // TODO:
    //  - Sign Out / Sign In page if user is or not signed in
    //  - Sign Out button to sign out when signed in


    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="img-container">
                    <img src={user.photoURL} alt="User Profile Photo"/>
                </div>
                <div className="text-container">
                    <h1>{user.displayName}</h1>
                    <p>{user.email}</p>
                </div>
                <button> Edit Display Name </button>
            </div>

        </div>
      );
}

export default UserProfile;