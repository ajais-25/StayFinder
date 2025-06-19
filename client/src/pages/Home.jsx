import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import PropertyListings from "../components/PropertyListings";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to StayFinder
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing places to stay around the world
            </p>

            {user && (
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p className="text-blue-700">
                  Welcome back, {user.name || "User"}! 🏠
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <PropertyListings />
    </div>
  );
};

export default Home;
