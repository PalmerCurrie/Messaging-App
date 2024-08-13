/* eslint-disable react/prop-types */
import "../styles/HomePage.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to chat.</h1>
      <p className="home-description">
        An online messgaing application for all your needs!
      </p>
      <div className="shop-now-button">
        <Link to="/message">
          <button className="button">Chat Now</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
