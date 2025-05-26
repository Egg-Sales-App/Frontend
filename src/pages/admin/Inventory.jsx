import React from "react";

const SalesPurchaseChart = () => {
  return (
    <section className="relative w-[690px] h-[360px] bg-white rounded-[10px] shadow-md p-4 overflow-hidden">
      {/* Title and Buttons */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[20px] text-gray-800 font-medium">Sales & Purchase</h2>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-1 rounded shadow-sm text-sm text-gray-600">Weekly</div>
          <div className="bg-white px-4 py-1 rounded shadow-sm text-sm text-gray-600">Daily</div>
        </div>
      </div>

      {/* Y-axis Labels */}
      <div className="absolute left-4 top-[74px] flex flex-col justify-between h-[218px] text-xs text-gray-500">
        {["60,000", "50,000", "40,000", "30,000", "20,000", "10,000"].map((val, idx) => (
          <span key={idx}>{val}</span>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="absolute top-[82px] left-[101px]">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="w-[542px] h-[41px] border-b border-gray-300"></div>
        ))}
      </div>

      {/* Bars */}
      <div className="absolute top-[89px] left-[146px] flex gap-6 items-end">
        {[
          { purchase: 186, sales: 163 },
          { purchase: 198, sales: 157 },
          { purchase: 144, sales: 177 },
          { purchase: 112, sales: 139 },
          { purchase: 139, sales: 151 },
          { purchase: 78, sales: 130 },
          { purchase: 186, sales: 163 },
          { purchase: 144, sales: 134 },
          { purchase: 144, sales: 139 },
          { purchase: 112, sales: 139 },
        ].map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="flex gap-1 items-end">
              <div
                className="w-2.5 rounded-b-[40px]"
                style={{
                  height: `${bar.purchase}px`,
                  background: "linear-gradient(to top, #817AF3, #74B0FA)",
                }}
              />
              <div
                className="w-2.5 rounded-b-[40px]"
                style={{
                  height: `${bar.sales}px`,
                  background: "linear-gradient(to top, #46A36C, #51CC5D)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="absolute left-[147px] top-[293px] flex gap-6 text-[12px] text-gray-400">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "May", "Jun"].map((month, idx) => (
          <span key={idx}>{month}</span>
        ))}
      </div>

      {/* Legends */}
      <div className="absolute left-[141px] top-[341px] flex items-center gap-2 text-[12px] text-gray-500">
        <div className="w-4 h-4 rounded-full" style={{ background: "linear-gradient(to top, #817AF3, #74B0FA)" }}></div>
        <span>Purchase</span>
        <div className="ml-6 w-4 h-4 rounded-full" style={{ background: "linear-gradient(to top, #46A36C, #51CC5D)" }}></div>
        <span>Sales</span>
      </div>
    </section>
  );
};

export default SalesPurchaseChart;
