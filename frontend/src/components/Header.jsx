import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSlide } from "../contexts/SlideContext";
import { useAuth } from "../contexts/AuthContext";

function Header({ overlay = false }) {
  const { currentSlideIndex } = useSlide();
  const { user } = useAuth();
  const location = useLocation();

  // Pages with specific solid backgrounds
  const isAlternatePage =
    ["/partner", "/adopt", "/event"].includes(location.pathname) ||
    location.pathname.startsWith("/pet/") ||
    location.pathname.startsWith("/event/") ||
    location.pathname.startsWith("/adopt/apply/") ||
    location.pathname.startsWith("/article/");

  const isArticlePage = ["/article", "/volunteer"].includes(location.pathname);

  // Home page check
  const isHomePage = location.pathname === "/";

  const getTextColor = () => {
    return "text-white"; // Standardized for your current design
  };

  const getHoverColor = () => {
    if (isAlternatePage) return "hover:text-[hsl(24,51%,46%)]";
    if (isArticlePage) return "hover:text-[hsl(38,51%,60%)]";

    switch (currentSlideIndex) {
      case 0:
        return "hover:text-amber-300";
      case 1:
        return "hover:text-[hsl(18,100%,80%)]";
      case 2:
        return "hover:text-[hsl(24,51%,46%)]";
      default:
        return "hover:text-gray-300";
    }
  };

  const getBackgroundColor = () => {
    if (isAlternatePage) return "bg-[#d5a07d]";
    if (isArticlePage) return "bg-[hsl(166,100%,15%)]";
    // On Home, keep it transparent to show the slider, or add a slight blur
    return isHomePage ? "bg-transparent" : "bg-white/10 backdrop-blur-md";
  };

  const textColor = getTextColor();
  const hoverColor = getHoverColor();
  const backgroundColor = getBackgroundColor();

  return (
    <nav
      className={`navbar ${
        // Changed 'fixed' to 'absolute' so it scrolls away
        overlay ? "absolute top-0 left-0 right-0 z-50 w-full" : "w-full"
      } ${backgroundColor} transition-colors duration-300 ease-in-out`}
    >
      <ul
        className={`flex justify-between items-center p-4 text-lg font-semibold transition-colors duration-500 ease-in-out ${textColor}`}
      >
        {/* Left: Logo */}
        <li>
          <NavLink
            to="/"
            className={`block px-4 py-2 cursor-pointer ${hoverColor} transition-colors`}
          >
            FurEver
          </NavLink>
        </li>

        {/* Center: Navigation Links */}
        <div className="flex gap-10 z-99">
          <li className="relative group z-99">
            <span
              className={`block px-4 py-2 ${hoverColor} rounded cursor-pointer transition-colors z-99`}
            >
              Adopt or Support
            </span>
            <ul className="text-black hidden absolute top-full left-0 group-hover:block bg-white shadow-xl p-4 space-y-2 min-w-[200px] rounded-lg">
              <li>
                <NavLink
                  to="/adopt"
                  className="block px-2 py-1 hover:text-amber-600"
                >
                  Find a Pet
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/event"
                  className="block px-2 py-1 hover:text-amber-600"
                >
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/volunteer"
                  className="block px-2 py-1 hover:text-amber-600"
                >
                  Volunteers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/partner"
                  className="block px-2 py-1 hover:text-amber-600"
                >
                  Partner with Us
                </NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink
              to="/article"
              className={`block px-4 py-2 ${hoverColor} transition-colors`}
            >
              Furticle
            </NavLink>
          </li>
        </div>

        {/* Right Side: Icons */}
        <div className="flex flex-row justify-end gap-5 items-center px-4">
          {user ? (
            <>
              <button className={`${hoverColor} transition-colors`}>
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="currentColor"
                >
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
              </button>
              <NavLink
                to="/profile"
                className={`${hoverColor} transition-colors`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/signin"
              className={`block px-4 py-2 ${hoverColor} transition-colors`}
            >
              Sign In
            </NavLink>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Header;
