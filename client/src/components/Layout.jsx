import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;
