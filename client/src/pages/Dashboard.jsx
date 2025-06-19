import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600">
                This is a protected dashboard page. Only authenticated users can
                access this.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Total Bookings
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-green-900">
                    Active Stays
                  </h3>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-yellow-900">
                    Pending Reviews
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-purple-900">
                    Favorites
                  </h3>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    No recent activity to display.
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

export default Dashboard;
