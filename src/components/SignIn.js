import { signInWithGoogle } from "../backend/backend.js";


// See if i should be passing auth as a prop,
// and if so, add a handleSignInFunction so I can pass into signInWithGoogle with prop
function SignIn() {

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

export default SignIn;
