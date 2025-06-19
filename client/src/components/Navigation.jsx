import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { API } from "../api";

const Navigation = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-600 text-sm">
                Welcome, {user.name || user.email || "User"}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
