const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black pt-10 px-6 animate-pulse">
      <div className="relative max-w-6xl mx-auto text-center mb-16">
        
        {/* Title/Heading Skeleton */}
        <div className="h-16 bg-slate-800 rounded-xl w-3/4 mx-auto mb-4"></div>
        
        {/* Subtitle Skeleton */}
        <div className="h-6 bg-slate-800 rounded-lg w-1/3 mx-auto mb-8"></div>

        {/* 3 Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((id) => (
            <div key={id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-32 flex flex-col justify-between">
              <div className="h-8 bg-slate-800 rounded-lg w-1/3"></div>
              <div className="h-4 bg-slate-800 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-16">
          <div className="inline-block h-14 bg-slate-800 w-44 rounded-xl mx-auto"></div>
        </div>

      </div>
    </div>
  );
};

export default HomeSkeleton;