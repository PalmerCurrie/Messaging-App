import "../styles/DirectMessage.css";


function DirectMessage( {key, useruid, user, userData} ) {

    
    return (
    <div className='direct-message-container'>
        <p> {userData.customUserName} </p>
    </div>
    )
}

export default DirectMessage;