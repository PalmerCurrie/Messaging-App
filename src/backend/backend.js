import { initializeApp } from "firebase/app";
// import { createHash } from 'crypto';
import {
    collection,
    serverTimestamp,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    getFirestore,
    orderBy,
    limit,
    addDoc,
    deleteDoc,
    getDoc,
    updateDoc,
    arrayUnion,
  } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut, getAuth } from "firebase/auth";



// App:

const firebaseConfig = {
    apiKey: "AIzaSyA8vNUAKgWZAg5h4S0IruOe6DvjE2rYUwc",
    authDomain: "messaging-app-f254c.firebaseapp.com",
    projectId: "messaging-app-f254c",
    storageBucket: "messaging-app-f254c.appspot.com",
    messagingSenderId: "298980020951",
    appId: "1:298980020951:web:5c237d7e0385d56dd69692",
    measurementId: "G-V6CE7T8Y4P",
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


// function addUserToDatabase(user) {
//     checkIfUserExists(user);
// }

function checkIfUserExists(user) {
    const usersRef = collection(firestore, "users");
    if (user) {
        // Check if user already exists in Firestore
        const userQuery = query(usersRef, where("uid", "==", user.uid));
        getDocs(userQuery)
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              addUserToFirestore(user);
            } else {
              console.log("User already exists in Firestore");
            }
          })
          .catch((error) => {
            console.error("Error checking user existence: ", error);
          });
      }
}


// Add User to Firestore Database if user does not exist already
async function addUserToFirestore(userData) {
    try {
      const userRef = doc(firestore, "users", userData.uid);
      await setDoc(userRef, {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        createdAt: serverTimestamp(),
        customUserName: userData.displayName,
        directMessages: [],
      });

      console.log("User added to Firestore with ID: ", userData.uid);
    } catch (error) {
      console.error("Error adding user to Firestore: ", error);
    }
};







// ChatRoom:

async function getGlobalMessages() {
  try {
    const messagesRef = collection(firestore, "messages");
    const chatMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
    const querySnapshot = await getDocs(chatMessageQuery);

    const chatMessages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return chatMessages;
  } catch (error) {
    console.error("Error fetching global messages:", error);
    return [];
  }
}



async function getDirectMessages(directMessageID) {
  try {

    if (typeof directMessageID !== 'string') {
      throw new Error('directMessageID must be a string.');
    }

    const messagesRef = collection(firestore, directMessageID);
    const chatMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(25));
    const querySnapshot = await getDocs(chatMessageQuery);

    const chatMessages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return chatMessages;
  } catch (error) {
    console.log("Error fetching direct messages: ", directMessageID, error);
    return [];
  }

}

async function getChatName(recieverID) {
  try {
    const userDocRef = doc(firestore, "users", recieverID);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      // setUserData(docSnap.data());
      // return userData?
      const data = docSnap.data().customUserName;
      return data;
    } else {
      console.log("User document does not exist");
    }
  } catch (error) {
    console.log("Error getting chat name: ", error);
  }
}


// fetchUserData
async function fetchUserData(user) {
  if (user) {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        // setUserData(docSnap.data());
        // return userData?
        const data = docSnap.data();
        return data;
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};

async function fetchDirectMessages(user) {
  if (user) {
    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.directMessages || [];
      } else {
        console.log("User document does not exist");
        return [];
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  }
  return [];
}


async function fetchChatName(recieverID) {
  if (recieverID === "global") {
    return "global";
  }
  try {
    const userDocRef = doc(firestore, "users", recieverID);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data().customUserName;
    } else {
      console.log("User document does not exist");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


// Function to send a message
async function sendMessage(messageObject) {
  const messagesRef = collection(firestore, "messages");
  
  try {
    await addDoc(messagesRef, messageObject);
  } catch (error) {
    console.error("Error adding message: ", error);
  }
};

// Function to send a direct message
async function sendDirectMessage(messageObject, directMessageID) {
  try {
    console.log("Sending Direct Message in backend", messageObject, directMessageID);

    // Create a reference to the collection using the directMessageID as the collection name
    const collectionRef = collection(firestore, directMessageID);

    // Create a reference to the document with the id specified in messageObject
    const docRef = doc(collectionRef, messageObject.id);

    // Set the document with the messageObject data
    await setDoc(docRef, messageObject);

    console.log("Message successfully sent!");
  } catch (error) {
    console.error("Error sending direct message:", error);
  }
}

// Function to generate unique direct message ID given two users uids.
// user input order does not matter
// returns a string of a unique hash which will be used as the directMessageID
async function getDirectMessageID(user1UID, user2UID) {
  // Ensure consistent ordering of UIDs
  const [firstUID, secondUID] = [user1UID, user2UID].sort();
  const concatenatedUIDs = `${firstUID}-${secondUID}`;

  console.log("DirectMessageID: ", concatenatedUIDs); // Placeholder for testing

  return concatenatedUIDs;
}


// ChatMessage


// General function to handle deleting messages
// collectionName: "messages" for global.
// collectionName: directMessageID for direct messages
async function deleteMessage(collectionName, messageID) {
  if (!collectionName || !messageID) {
    console.error("Invalid collectionName or messageID");
    return;
  }

  try {
    // Create a query against the collection
    const messagesRef = collection(firestore, collectionName);
    const q = query(messagesRef, where("id", "==", messageID));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No document found with ID: ", messageID);
      return;
    }

    // Iterate through and delete each matching document
    for (const document of querySnapshot.docs) {
      await deleteDoc(document.ref);
      console.log(`Document with ID ${document.id} successfully deleted!`);
    }
  } catch (error) {
    console.error("Error removing document: ", error);
  }
}



// DirectMessageSidebar:


// Function to addFriend given email
async function addFriend(userEmail, user) {
    try {
      const usersCollection = collection(firestore, "users"); // Accessing collection from Firestore instance
      const querySnapshot = await getDocs(
        query(usersCollection, where("email", "==", userEmail))
      );

      if (!querySnapshot.empty) {
        const friendID = querySnapshot.docs[0].id;

        // Check if friendId is already in directMessages
        if (user.directMessages.includes(friendID)) {
          console.log("Friend is already added.");
          return;
        }

        // Update directMessages for the current user
//!!!!!  This part will have to change when I redesign the way directMessages are handled
        const userDocRef = doc(firestore, "users", user.uid);
        await updateDoc(userDocRef, {
          directMessages: arrayUnion(friendID),
        });
      } else {
        console.log("No user found with that email");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
};



// SignIn / SignOut

function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

function handleSignOut() {
  auth.currentUser && signOut(auth);
}



// UserProfile:


// updateDisplayName
async function updateDisplayName(newDisplayName, user) {
  try {
    const userRef = doc(firestore, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      // Document exists, proceed with update
      await updateDoc(userRef, {
        customUserName: newDisplayName,
      });
      user.customUserName = newDisplayName;
    } else {
      console.error("Document does not exist");
    }
  } catch (error) {
    console.error("Error updating display name: ", error);
  }
};


export {
  // addUserToDatabase, 
  auth,
  checkIfUserExists,
  addUserToFirestore, 
  getGlobalMessages, 
  getDirectMessages, 
  getChatName, 
  fetchUserData,
  fetchDirectMessages,
  fetchChatName,
  sendMessage,
  sendDirectMessage,
  getDirectMessageID,
  deleteMessage,
  addFriend,
  signInWithGoogle,
  handleSignOut,
  updateDisplayName,
}