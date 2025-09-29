import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-300 flex">
      {/* Logos */}
      <h1>
        <NavLink to="/">Furever</NavLink>
      </h1>

      {/* Navigation Bar */}
      <div>
        <nav>
          <ul>
            <li>
              Adopt or Support
              <ul>
                <li>
                  <NavLink to="/adopt">Find a Pet</NavLink>
                </li>
                <li>
                  <NavLink to="/event">Events</NavLink>
                </li>
                <li>
                  <NavLink to="/volunteer">Volunteers</NavLink>
                </li>
                <li>
                  <NavLink to="/ngo">NGO List</NavLink>
                </li>
                <li>
                  <NavLink to="/map">Map</NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink to="/article">Furticle</NavLink>
            </li>
            <li>
              <NavLink to="/surrender">Surrender</NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Sign up Button */}
      <div>
        <button>
          <NavLink to="/signin">Sign In</NavLink>
        </button>
      </div>
    </header>
  );
}
export default Header;
