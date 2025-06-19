const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-300"></div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-2"></div>

        {/* Location skeleton */}
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>

        {/* Price and host skeleton */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 bg-gray-300 rounded w-24"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

const PropertyListingsSkeleton = () => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>

        {/* Filters skeleton */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-1"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-end space-x-2">
              <div className="h-10 bg-gray-300 rounded w-20"></div>
              <div className="h-10 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Results info skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        {/* Property grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export { PropertyCardSkeleton, PropertyListingsSkeleton };
