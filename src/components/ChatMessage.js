import "../styles/ChatMessage.css"

function ChatMessage({ key, message, currentUser }) {

    const { uid, text, photoURL, createdAt, displayName, customUserName} = message;

    if (!message || !message.createdAt) {
        return null; // Return null or handle the case where message or createdAt is missing
    }


    // Calculate the date from Firestore Timestamp
    const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);

    // Function to format date
    const formatDate = (date) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        };

        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Format date into MM/DD/YYYY h:mm A format
    const formattedDate = formatDate(date);

    // Determine the message class based on sender
    const messageClass = uid === currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`} key={key}>
            <div className="message-content">
                {messageClass === 'received' && (
                    <img src={photoURL} alt="User avatar" className="avatar" />
                )}
                <div className="message-text">
                {messageClass === 'received' && (
                    <p className="username">{customUserName || displayName}</p>
                )}
                    <p>{text}</p>
                    <p className="timestamp">{formattedDate}</p>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;