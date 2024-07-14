/* eslint-disable react/prop-types */
import '../styles/Header.css'
import { Link } from 'react-router-dom'

function Header() {

  return (
    <>
      <header className="header">
        <Link to="/message" className="logo-link"> 
            <div className="logo">
                <span className="logo-text">chat.</span>
            </div>
        </Link>
            <nav className="nav-links">
                <ul>
                    <li>
                        <Link to="/message">Messages</Link>
                    </li>
                </ul>
            </nav>
            <Link to="/profile">
                <div className="nav-links">
                    <p>Profile</p>
                </div>
            </Link>
        </header>

    </>
  )
}

export default Header