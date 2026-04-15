export default function ClientDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="h-4 w-40 bg-gray-200 rounded mb-6" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="h-8 w-52 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-16 bg-gray-200 rounded-md" />
            <div className="h-9 w-20 bg-gray-200 rounded-md" />
            <div className="h-9 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="h-3 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Links box */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
          <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded mb-4" />
          <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>

        {/* Members heading */}
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />

        {/* Members table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gray-50 border-b border-gray-200 h-11" />
          <div className="flex items-center gap-6 px-5 py-4 border-b border-gray-100">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-5 w-14 bg-gray-100 rounded-full" />
          </div>
          <div className="px-5 py-4 flex gap-3">
            <div className="h-8 w-44 bg-gray-100 rounded-md" />
            <div className="h-8 w-56 bg-gray-100 rounded-md" />
            <div className="h-8 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Leads heading */}
        <div className="h-6 w-24 bg-gray-200 rounded mb-4" />

        {/* Leads table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 h-11" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-gray-100 last:border-0">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
              <div className="h-4 w-8 bg-gray-100 rounded ml-auto" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
