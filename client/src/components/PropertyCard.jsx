import { useState } from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ listing }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = () => {
    setImageError(true);
  };

  const nextImage = () => {
    if (listing.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === listing.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (listing.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listing.images.length - 1 : prev - 1
      );
    }
  };

  const currentImage =
    listing.images && listing.images.length > 0
      ? listing.images[currentImageIndex]
      : null;
  return (
    <Link
      to={`/listing/${listing._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        {currentImage && !imageError ? (
          <>
            {" "}
            <img
              src={currentImage}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
            {listing.images.length > 1 && (
              <>
                {" "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md transition-all duration-200 z-10 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>{" "}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md transition-all duration-200 z-10 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {listing.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {listing.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{listing.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-right">
            <span className="text-xl font-bold text-gray-900">
              ${listing.pricePerNight}
            </span>
            <span className="text-gray-600 text-sm ml-1">/ night</span>
          </div>

          {listing.host && (
            <div className="text-xs text-gray-500">
              Host: {listing.host.name}
            </div>
          )}
        </div>

        {listing.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {listing.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
