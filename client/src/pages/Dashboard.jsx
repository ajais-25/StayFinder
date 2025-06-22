import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listingsAPI, bookingsAPI } from "../api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("listings");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsResponse, bookingsResponse] = await Promise.all([
        listingsAPI.getHostListings(),
        bookingsAPI.getHostBookings(),
      ]);

      setListings(listingsResponse.data.data || []);
      setBookings(bookingsResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await listingsAPI.delete(listingId);
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
      setError("Failed to delete listing");
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name || "Host"}!
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-blue-900">
                Total Listings
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {listings.length}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-green-900">
                Total Bookings
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {bookings.length}
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-yellow-900">
                Confirmed Bookings
              </h3>
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border">
              <h3 className="text-lg font-semibold text-purple-900">
                Monthly Revenue
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                ₹
                {bookings
                  .filter((b) => b.status === "confirmed")
                  .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("listings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "listings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Listings ({listings.length})
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Received Bookings ({bookings.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === "listings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Listings
                </h2>
                <Link
                  to="/create-listing"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add New Listing
                </Link>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5V9a2 2 0 012-2h2a2 2 0 012 2v6.5M7 21h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v12"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No listings yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first listing.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-listing"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add New Listing
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <div
                      key={listing._id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={
                            listing.images?.[0] ||
                            "https://via.placeholder.com/400x225?text=No+Image"
                          }
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {listing.location}
                        </p>
                        <p className="text-lg font-bold text-green-600 mb-4">
                          ₹{listing.pricePerNight}/night
                        </p>
                        <div className="flex space-x-2">
                          <Link
                            to={`/listing/${listing._id}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Received Bookings
              </h2>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V8a2 2 0 012-2h4a2 2 0 012 2v1"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No bookings yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    When guests book your listings, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.listing?.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Guest: {booking.guest?.name} ({booking.guest?.email}
                            )
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Check-in:</span>
                              <p>
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Check-out:</span>
                              <p>
                                {new Date(
                                  booking.checkOut
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Total Price:</span>
                              <p className="text-green-600 font-semibold">
                                ₹{booking.totalPrice}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <p>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
