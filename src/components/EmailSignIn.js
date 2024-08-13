import React, { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../backend/backend.js";
import { signInWithGoogle } from "../backend/backend.js";

function EmailSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      console.log("Signed in successfully");
    } catch (error) {
      setError(error.message);
      console.error("Error signing in:", error.message);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      console.log("Signed up successfully");
    } catch (error) {
      setError(error.message);
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleEmailSignIn}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign In</button>
        <button onClick={handleEmailSignUp}>Sign Up</button>
      </form>
      <hr />
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default EmailSignIn;
