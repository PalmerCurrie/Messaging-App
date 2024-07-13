import {signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function SignIn( {auth} ) {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };
  
    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}
  

export default SignIn;