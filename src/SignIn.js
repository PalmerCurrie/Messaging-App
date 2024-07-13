import {signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function SignIn( {auth} ) {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        // const provider = new GoogleAuthProvider();
        // signInWithPopup(auth, provider)
        // // .then((result) => {
        // //     // Handle the result here
        // //     console.log(result);
        // // })
        // // .catch((error) => {
        // //     // Handle Errors here.
        // //     console.error(error);
        // // });
    };
  
    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    )
}
  

export default SignIn;