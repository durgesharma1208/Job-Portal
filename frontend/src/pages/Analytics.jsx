const Analytics = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-5xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-blue-500 p-6 rounded-xl">
          Total Users
        </div>

        <div className="bg-green-500 p-6 rounded-xl">
          Total Jobs
        </div>

        <div className="bg-purple-500 p-6 rounded-xl">
          Applications
        </div>

      </div>
    </div>
  );
};

export default Analytics;