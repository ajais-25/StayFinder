import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays, addDays } from "date-fns";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [unavailableDates, setUnavailableDates] = useState([]);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/listings/${id}`);
        if (response.data.success) {
          setListing(response.data.data);
          // Set unavailable dates from the response
          if (response.data.data.unavailableDates) {
            setUnavailableDates(response.data.data.unavailableDates);
          }
        } else {
          setError(response.data.message || "Failed to fetch listing");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  // Calculate total price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate && listing) {
      const numberOfNights = differenceInDays(checkOutDate, checkInDate);
      if (numberOfNights > 0) {
        setNights(numberOfNights);
        setTotalPrice(numberOfNights * listing.pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, listing]);
  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      setBookingError("Please select check-in and check-out dates");
      return;
    }

    if (checkOutDate <= checkInDate) {
      setBookingError("Check-out date must be after check-in date");
      return;
    }

    if (checkInDate < new Date()) {
      setBookingError("Check-in date cannot be in the past");
      return;
    }

    // Check if selected date range contains any unavailable dates
    if (hasUnavailableDatesInRange()) {
      setBookingError(
        "Selected dates contain unavailable dates. Please choose different dates."
      );
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");
      setBookingSuccess("");

      const bookingData = {
        listing: listing._id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        totalPrice: totalPrice,
      };

      const response = await api.post("/bookings", bookingData);

      if (response.data.success) {
        setBookingSuccess("Booking created successfully!");
        setCheckInDate(null);
        setCheckOutDate(null);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setBookingError(response.data.message || "Failed to create booking");
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Failed to create booking"
      );
    } finally {
      setBookingLoading(false);
    }
  };
  // Date picker restrictions
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) {
      return true;
    }

    // Disable unavailable dates
    const dateString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    return unavailableDates.includes(dateString);
  };
  const getMinCheckOutDate = () => {
    if (checkInDate) {
      return addDays(checkInDate, 1);
    }
    return addDays(new Date(), 1);
  };

  // Check if selected date range contains any unavailable dates
  const hasUnavailableDatesInRange = () => {
    if (!checkInDate || !checkOutDate) return false;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    for (
      let date = new Date(start);
      date < end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().split("T")[0];
      if (unavailableDates.includes(dateString)) {
        return true;
      }
    }
    return false;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Listing not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 cursor-pointer hover:underline transition duration-200"
            >
              Home
            </button>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-medium">{listing.title}</span>
          </li>
        </ol>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Listing Details */}
        <div className="lg:col-span-2">
          {/* Title and Location */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {listing.title}
            </h1>
            <p className="text-gray-600 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {listing.location}
            </p>
          </div>
          {/* Images */}
          <div className="mb-6">
            {listing.images && listing.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
                {listing.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.title} ${index + 2}`}
                    className="w-full h-32 md:h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>
          {/* Host Information */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hosted by {listing.host.name}
            </h3>
            <p className="text-gray-600">
              Contact: {listing.host.email}
              {listing.host.phoneNumber && ` | ${listing.host.phoneNumber}`}
            </p>
          </div>
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About this place
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>{" "}
          {/* Availability */}
          {listing.availability &&
            (listing.availability.start || listing.availability.end) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.availability.start && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Available from:
                      </span>
                      <p className="text-gray-900">
                        {format(
                          new Date(listing.availability.start),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  )}
                  {listing.availability.end && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Available until:
                      </span>
                      <p className="text-gray-900">
                        {format(
                          new Date(listing.availability.end),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">
                    ${listing.pricePerNight}
                  </span>
                  <span className="text-gray-600 ml-1">per night</span>
                </div>
              </div>{" "}
              {/* Booking Form */}
              <form onSubmit={handleBooking} className="space-y-4">
                {/* Date Selection Instructions */}
                {unavailableDates.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Note:</span> Dates not
                      highlighted are unavailable for booking.
                    </p>
                  </div>
                )}
                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    filterDate={(date) => !isDateDisabled(date)}
                    placeholderText="Select check-in date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dateFormat="MMM dd, yyyy"
                    minDate={new Date()}
                  />
                </div>
                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    filterDate={(date) => !isDateDisabled(date)}
                    placeholderText="Select check-out date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dateFormat="MMM dd, yyyy"
                    minDate={getMinCheckOutDate()}
                    disabled={!checkInDate}
                  />
                </div>
                {/* Booking Summary */}
                {nights > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          ${listing.pricePerNight} × {nights} nights
                        </span>
                        <span>${listing.pricePerNight * nights}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Error and Success Messages */}
                {bookingError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{bookingError}</p>
                  </div>
                )}
                {bookingSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{bookingSuccess}</p>
                  </div>
                )}{" "}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    bookingLoading ||
                    !checkInDate ||
                    !checkOutDate ||
                    listing.host._id === user?._id ||
                    hasUnavailableDatesInRange()
                  }
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition duration-200"
                >
                  {bookingLoading
                    ? "Creating Booking..."
                    : listing.host._id === user?._id
                    ? "Cannot book your own listing"
                    : hasUnavailableDatesInRange()
                    ? "Selected dates unavailable"
                    : "Reserve"}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3 text-center">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
