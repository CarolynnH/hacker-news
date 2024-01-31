import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../components/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img className="logo-img" src={logo} alt="Logo" />
          <a href="/" className="site-title">
            Hacker News
          </a>
        </div>
        <div className="nav-elements">
          <ul>
            <li>
              <NavLink>New</NavLink>
            </li>
            <li>
              <NavLink>Past</NavLink>
            </li>
            <li>
              <NavLink>Comments</NavLink>
            </li>
            <li>
              <NavLink>Ask</NavLink>
            </li>
            <li>
              <NavLink>Show</NavLink>
            </li>
            <li>
              <NavLink>Jobs</NavLink>
            </li>
            <li>
              <NavLink>Submit</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
