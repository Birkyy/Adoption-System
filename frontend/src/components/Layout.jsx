import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { SlideProvider } from "../contexts/SlideContext";
import BackButton from "./BackButton";

function Layout() {
  const location = useLocation();

  const isHome = ["/", "/home"].includes(location.pathname);

  // Add "/profile" to this list to hide the header on that page
  const hideHeaderRoutes = [
    "/signin",
    "/register",
    "/profile",
    "/admin",
    "/ngo",
  ];

  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <SlideProvider>
      <div className="flex flex-col min-h-screen min-w-screen">
        <div id="elevator-target"></div>

        {/* Conditionally render the Header */}
        {showHeader && <Header overlay={isHome} />}

        <main className="bg-white flex-1">
          <Outlet />
        </main>

        {isHome && <BackButton />}
        {isHome && <Footer />}
      </div>
    </SlideProvider>
  );
}

export default Layout;
