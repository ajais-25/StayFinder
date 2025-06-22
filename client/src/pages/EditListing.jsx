import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { listingsAPI } from "../api";

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingListing, setFetchingListing] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);

  // Fetch existing listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setFetchingListing(true);
        const response = await listingsAPI.getById(id);
        if (response.data.success) {
          const listing = response.data.data;

          // Check if the current user is the host
          if (listing.host._id !== user?._id) {
            setError("You are not authorized to edit this listing");
            return;
          }

          setFormData({
            title: listing.title,
            description: listing.description,
            location: listing.location,
            pricePerNight: listing.pricePerNight.toString(),
            images: [],
          });
          setExistingImages(listing.images || []);
        } else {
          setError(response.data.message || "Failed to fetch listing");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch listing");
      } finally {
        setFetchingListing(false);
      }
    };

    if (id && user) {
      fetchListing();
    }
  }, [id, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("location", formData.location);
      submitData.append("pricePerNight", formData.pricePerNight);

      // Append new images if any
      if (formData.images.length > 0) {
        formData.images.forEach((image) => {
          submitData.append("images", image);
        });
      }

      const response = await listingsAPI.update(id, submitData);

      if (response.data.success) {
        navigate(`/listing/${id}`);
      } else {
        setError(response.data.message || "Failed to update listing");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingListing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
          <p className="text-gray-600 mt-2">
            Update your property details and information
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter property title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="Describe your property in detail..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter property location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price per Night */}
            <div>
              <label
                htmlFor="pricePerNight"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price per Night (₹) *
              </label>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
                placeholder="Enter price per night"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Current image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-200"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Update Images (Optional)
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select new images to replace the current ones. Leave empty to
                keep current images.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/listing/${id}`)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                {loading ? "Updating..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
