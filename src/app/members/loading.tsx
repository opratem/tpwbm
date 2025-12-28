export default function MembersLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
