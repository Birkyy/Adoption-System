import { NavLink } from "react-router-dom";
import { useSlide } from "../contexts/SlideContext";

function Header({ overlay = false }) {
  const { currentSlideIndex } = useSlide();

  // Define text colors for each slide
  const getTextColor = () => {
    switch (currentSlideIndex) {
      case 0:
      case 1:
      case 2:
        return "text-white";
      default:
        return "text-black";
    }
  };

  const getHoverColor = () => {
    switch (currentSlideIndex) {
      case 0:
        return "hover:text-amber-300";
      case 1:
        return "hover:text-[hsl(18,100%,80%)]";
      case 2:
        return "hover:text-[hsl(24,51%,46%)]";
      default:
        return "text-black";
    }
  };

  const textColor = getTextColor();
  const hoverColor = getHoverColor();

  return (
    // Header.jsx
    <nav
      className={`navbar ${
        overlay ? "absolute top-0 left-0 right-0 z-50 w-full" : "w-full"
      }`}
    >
      <ul
        className={`flex justify-between p-4 bg-transparent text-lg font-semibold transition-colors duration-500 ease-in-out ${textColor}`}
      >
        <li>
          <NavLink
            to="/"
            className={`block px-4 py-2 cursor-pointer ${hoverColor}`}
          >
            Home
          </NavLink>
        </li>

        <ul className="flex gap-10 transition-colors duration-500 ease-in-out">
          <li className="relative group">
            <span
              className={`block px-4 py-2 ${hoverColor} rounded cursor-pointer`}
            >
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
            <NavLink to="/article" className={`block px-4 py-2 ${hoverColor}`}>
              Furticle
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/surrender"
              className={`block px-4 py-2 ${hoverColor}`}
            >
              Surrender
            </NavLink>
          </li>
        </ul>

        <li>
          <NavLink to="/signin" className={`block px-4 py-2 ${hoverColor}`}>
            Sign In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
