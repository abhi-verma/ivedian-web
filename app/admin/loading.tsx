export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-20 bg-gray-200 rounded-md" />
          <div className="h-9 w-28 bg-gray-200 rounded-md" />
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="h-8 w-10 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 h-10" />
          ))}
        </div>

        {/* Table heading */}
        <div className="h-6 w-28 bg-gray-200 rounded mb-4" />

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 h-11" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-gray-100 last:border-0">
              <div className="h-4 w-36 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
              <div className="h-5 w-14 bg-gray-100 rounded-full" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-8 bg-gray-100 rounded ml-auto" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
