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
            </ul>
          </li>

          <li>
            <NavLink to="/article" className={`block px-4 py-2 ${hoverColor}`}>
              Furticle
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/surrender"
              className={`block px-4 py-2 ${hoverColor}`}
            >
              Surrender
            </NavLink>
          </li> */}
        </ul>
        <div className="flex flex-row justify-end gap-5 items-center">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="notification"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                d="M9.66385809,17.0850308 C10.1612052,17.0997055 10.6494874,17.2209963 11.0952733,17.4405986 L11.0952733,17.4405986 L11.1221123,17.4405986 C11.4945539,17.7444568 11.5578428,18.2868367 11.2652539,18.6673073 C10.7325,19.4297129 9.88007929,19.9104286 8.94815048,19.9740188 C7.99068936,20.0881969 7.02648958,19.8231391 6.26424693,19.2362157 C5.87223416,18.9673952 5.61748007,18.5422722 5.56643201,18.0717313 C5.56643201,17.5739365 6.03164196,17.3428174 6.46106652,17.2450363 C6.96403775,17.1390934 7.47674317,17.0854692 7.99089154,17.0850308 L7.99089154,17.0850308 Z M8.5366186,-1.59872116e-14 C11.632054,-1.59872116e-14 14.8258992,2.24007688 15.156914,5.48463268 C15.2105921,6.15132223 15.156914,6.84467936 15.2105921,7.5202581 C15.3862376,8.39147523 15.7905529,9.20107362 16.3825633,9.86700531 C16.7506233,10.4142844 16.9638305,11.04982 16.9999314,11.7070685 L16.9999314,11.7070685 L16.9999314,11.9115199 C17.0053658,12.7983874 16.6875755,13.6572551 16.1052266,14.3293807 C15.3671354,15.1185689 14.3656784,15.6145192 13.2871279,15.7249841 C10.1005486,16.1338607 6.87427876,16.1338607 3.68769953,15.7249841 C2.59644926,15.6229087 1.58089806,15.1262849 0.833815425,14.3293807 C0.269727524,13.6508093 -0.0260731338,12.7911986 0.00180532602,11.9115199 L0.00180532602,11.7070685 C0.0367179505,11.0522761 0.243355163,10.417938 0.601210451,9.86700531 C1.19585108,9.20045914 1.60588236,8.3917618 1.79107436,7.5202581 C1.84475243,6.84467936 1.79107436,6.16021142 1.84475243,5.48463268 C2.18471354,2.24007688 5.31593434,-1.59872116e-14 8.44715515,-1.59872116e-14 L8.44715515,-1.59872116e-14 Z"
                transform="translate(3.5 2)"
              ></path>
            </svg>
          </button>
          <button>
            <NavLink to="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="profile"
              >
                <path
                  fill="currentColor"
                  d="M5.84846399,13.5498221 C7.28813318,13.433801 8.73442297,13.433801 10.1740922,13.5498221 C10.9580697,13.5955225 11.7383286,13.6935941 12.5099314,13.8434164 C14.1796238,14.1814947 15.2696821,14.7330961 15.73685,15.6227758 C16.0877167,16.317132 16.0877167,17.1437221 15.73685,17.8380783 C15.2696821,18.727758 14.2228801,19.3149466 12.4926289,19.6174377 C11.7216312,19.7729078 10.9411975,19.873974 10.1567896,19.9199288 C9.43008411,20 8.70337858,20 7.96802179,20 L6.64437958,20 C6.36753937,19.9644128 6.09935043,19.9466192 5.83981274,19.9466192 C5.05537891,19.9062698 4.27476595,19.8081536 3.50397353,19.6530249 C1.83428106,19.3327402 0.744222763,18.7633452 0.277054922,17.8736655 C0.0967111971,17.5290284 0.00163408158,17.144037 0.000104217816,16.752669 C-0.00354430942,16.3589158 0.0886574605,15.9704652 0.268403665,15.6227758 C0.72692025,14.7330961 1.81697855,14.1548043 3.50397353,13.8434164 C4.27816255,13.6914539 5.06143714,13.5933665 5.84846399,13.5498221 Z M8.00262682,-1.16351373e-13 C10.9028467,-1.16351373e-13 13.2539394,2.41782168 13.2539394,5.40035587 C13.2539394,8.38289006 10.9028467,10.8007117 8.00262682,10.8007117 C5.10240696,10.8007117 2.75131423,8.38289006 2.75131423,5.40035587 C2.75131423,2.41782168 5.10240696,-1.16351373e-13 8.00262682,-1.16351373e-13 Z"
                  transform="translate(4 2)"
                ></path>
              </svg>
            </NavLink>
          </button>

          <li>
            <NavLink to="/signin" className={`block px-4 py-2 ${hoverColor}`}>
              Sign In
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Header;
