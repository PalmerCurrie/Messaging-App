/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
function HomePage({ user }) {
  // Reference the Firestore collection

  return (
    <div className="">
        <h1>Greetings! Welcome to chat.</h1>

        <Link to="/message">
          <div className="profile">
            <h1>Click here to view your messages!</h1>
          </div>
        </Link>
    </div>
  );
}

export default HomePage;
