import { NavLink } from "react-router-dom";

function Header({ overlay = false }) {
  return (
    // Header.jsx
    <nav
      className={`navbar ${
        overlay ? "absolute top-0 left-0 right-0 z-50 w-full" : "w-full"
      }`}
    >
      <ul className="flex justify-between p-4 bg-transparent text-md">
        <li>
          <NavLink to="/" className="block px-4 py-2 cursor-pointer">
            Home
          </NavLink>
        </li>

        <ul className="flex gap-10">
          <li className="relative group">
            <span className="block px-4 py-2 hover:text-gray-500 rounded cursor-pointer">
              Adopt or Support
            </span>
            <ul className="text-black hidden absolute top-full group-hover:block bg-white shadow-lg p-4 space-y-2 min-w-full rounded-lg z-50">
              <li>
                <NavLink
                  to="/adopt"
                  className="block px-1 py-2 hover:text-gray-500"
                >
                  Find a Pet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/event"
                  className="block px-1 py-2 hover:text-gray-500"
                >
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/volunteer"
                  className="block px-1 py-2 hover:text-gray-500"
                >
                  Volunteers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ngo"
                  className="block px-1 py-2 hover:text-gray-500"
                >
                  NGO List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/map"
                  className="block px-1 py-2 hover:text-gray-500"
                >
                  Map
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink
              to="/article"
              className="block px-4 py-2 hover:text-gray-500"
            >
              Furticle
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/surrender"
              className="block px-4 py-2 hover:text-gray-500"
            >
              Surrender
            </NavLink>
          </li>
        </ul>

        <li>
          <NavLink to="/signin" className="block px-4 py-2 hover:text-gray-500">
            Sign In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
