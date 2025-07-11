import React, { useState, useEffect } from "react";
import ProfitRevenueCard from "../../../components/ui/ProfitRevenueCard";
import BestSellingProductCard from "../../../components/ui/BestSellingProductCard";

const Reports = () => {
  // ✅ Add loading state
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  // ✅ Simulate data fetching
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Set your report data here
        setReportData({
          totalProfit: 21190,
          revenue: 18300,
          sales: 17432,
          // ... other report data
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading reports...</span>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Sales Report</h3>
                <p className="text-blue-600 text-sm">
                  Generate sales analytics
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">
                  Inventory Report
                </h3>
                <p className="text-green-600 text-sm">View stock levels</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">
                  Financial Report
                </h3>
                <p className="text-purple-600 text-sm">
                  Profit & loss analysis
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            {/* 2-Column Layout */}
            <div className="flex gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-3 w-1/2">
                <section className="w-full h-full bg-white rounded-lg p-6 shadow mt-2">
                  <h2 className="text-lg font-bold text-gray-800 mb-6">
                    Overview
                  </h2>

                  {/* Top stats row */}
                  <div className="flex justify-between mb-6">
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium text-gray-600">
                        GHS {(reportData?.totalProfit || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        Total Profit
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium text-gray-600">
                        GHS {reportData?.revenue?.toLocaleString()}
                      </span>
                      <span className="text-sm text-yellow-600">Revenue</span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-medium text-gray-600">
                        GHS {reportData?.sales?.toLocaleString()}
                      </span>
                      <span className="text-sm text-purple-600">Sales</span>
                    </div>
                  </div>

                  {/* Bottom stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-base font-medium text-gray-600">
                        GHS 117,432
                      </span>
                      <span className="text-sm text-gray-500">
                        Net purchase value
                      </span>
                    </div>
                    <div>
                      <span className="block text-base font-medium text-gray-600">
                        GHS 80,432
                      </span>
                      <span className="text-sm text-gray-500">
                        Net sales value
                      </span>
                    </div>
                    <div>
                      <span className="block text-base font-medium text-gray-600">
                        GHS 30,432
                      </span>
                      <span className="text-sm text-gray-500">MoM Profit</span>
                    </div>
                    <div>
                      <span className="block text-base font-medium text-gray-600">
                        GHS 110,432
                      </span>
                      <span className="text-sm text-gray-500">YoY Profit</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6 w-1/2">
                <section className="w-full bg-white rounded-lg p-4 shadow relative mt-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">
                      Best Selling Category
                    </h2>
                    <button className="text-sm text-blue-600 hover:underline">
                      See All
                    </button>
                  </div>

                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs text-gray-500 uppercase border-b">
                      <tr>
                        <th className="py-2">Category</th>
                        <th className="py-2">Turn Over</th>
                        <th className="py-2">Increase By</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3">Eggs</td>
                        <td className="py-3">GHS 26,000</td>
                        <td className="py-3">
                          <span className="text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                            3.2%
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3">Layers</td>
                        <td className="py-3">GHS 22,000</td>
                        <td className="py-3">
                          <span className="text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                            2%
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3">Pig Feeds</td>
                        <td className="py-3">GHS 22,000</td>
                        <td className="py-3">
                          <span className="text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">
                            1.5%
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>

            {/* Profit & Revenue Chart */}
            <ProfitRevenueCard />

            {/* Best Selling Product Card */}
            <BestSellingProductCard />
          </div>
        </>
      )}
    </>
  );
};

export default Reports;
