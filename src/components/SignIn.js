import { signInWithGoogle } from "../backend/backend.js";

function SignIn() {
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

export default SignIn;
