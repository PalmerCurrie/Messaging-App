function ChatMessage( {key, message, currentUser} ) {

    const { uid, text, photoURL } = message;
    const messageClass = uid === currentUser.uid ? 'sent' : 'recieved';

    return (
        <div className={`message ${messageClass}`} key={key}>
            {/* <img src={photoURL} alt="User avatar" /> */}
            <p>{text}</p>
        </div>
    )
}

export default ChatMessage;