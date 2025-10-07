import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header overlay={isHome} />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 bg-white overflow-hidden">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
