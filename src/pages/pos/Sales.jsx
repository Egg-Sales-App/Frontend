import React, { useState, useEffect } from "react";
import SalesDashboard from "../../components/ui/SalesDashboard";

const Sales = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading Sales...</span>
        </div>
      ) : (
        <>
          <section className="w-full p-3 mb-5 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              Overall Sales
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* Total Sales */}
              <div className="w-full sm:w-[250px] p-4 bg-blue-50 rounded-md shadow-sm">
                <h3 className="text-blue-600 text-base font-semibold mb-2">
                  Total Sales
                </h3>
                <p className="text-gray-700 text-lg font-semibold">37</p>
                <p className="text-sm text-gray-700 mt-2">Last 7 days</p>
              </div>

              {/* Total Received */}
              <div className="w-full sm:w-[250px] p-4 bg-orange-50 rounded-md shadow-sm ml-7">
                <h3 className="text-orange-600 text-base font-semibold mb-2">
                  Total Received
                </h3>
                <div className="flex justify-between text-gray-700 font-semibold">
                  <span>32</span>
                  <span>GHS 30,368</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>Last 7 days</span>
                  <span>Revenue</span>
                </div>
              </div>

              {/* Total Returned */}
              <div className="w-full sm:w-[250px] p-4 bg-purple-50 rounded-md shadow-sm ml-7">
                <h3 className="text-purple-600 text-base font-semibold mb-2">
                  Total Returned
                </h3>
                <div className="flex justify-between text-gray-700 font-semibold">
                  <span>5</span>
                  <span>GHS 80</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 mt-2">
                  <span>Last 7 days</span>
                  <span>Cost</span>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full mb-5 rounded-lg shadow-md">
            <SalesDashboard className="w-full" />
          </section>
        </>
      )}
    </>
  );
};

export default Sales;
