import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { SlideProvider } from "../contexts/SlideContext";

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <SlideProvider>
      <div className="flex flex-col min-h-screen min-w-screen">
        <Header overlay={isHome} />

        <main className="bg-white flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </SlideProvider>
  );
}

export default Layout;
