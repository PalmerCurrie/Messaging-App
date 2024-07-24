import { handleSignOut } from "../backend/backend.js";

function SignOut({ auth }) {
  const handleClick = () => {
    handleSignOut();
  }

  return (
    <button onClick={() => handleClick()}>Sign Out</button>
  );
}

export default SignOut;
