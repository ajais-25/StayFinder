import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to StayFinder
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                This is the protected home page. Only authenticated users can
                see this content.
              </p>

              {user && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">
                    User Information
                  </h3>
                  <p className="text-blue-700">
                    Welcome back, {user.name || "User"}!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Search Stays</h3>
                  <p className="text-blue-700">
                    Find your perfect accommodation
                  </p>
                </div>

                <div className="bg-green-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">My Bookings</h3>
                  <p className="text-green-700">
                    View your current reservations
                  </p>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Profile</h3>
                  <p className="text-purple-700">
                    Manage your account settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
