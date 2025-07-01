import React from "react";
import { FaBoxOpen } from "react-icons/fa"; // icon for product

const bestSellingData = [
  {
    product: "Pig feed",
    id: "23567",
    category: "Feeds",
    quantity: "225 kg",
    turnover: "GHS 17,000",
    increase: "2.3%",
  },
  {
    product: "Onion",
    id: "25831",
    category: "Vegetable",
    quantity: "200 kg",
    turnover: "₹10,000",
    increase: "1.3%",
  },
  {
    product: "Maggi",
    id: "56841",
    category: "Instant Food",
    quantity: "200 Packet",
    turnover: "₹9,000",
    increase: "1%",
  },
  {
    product: "Surf Execl",
    id: "23567",
    category: "Household",
    quantity: "125 Packet",
    turnover: "₹12,000",
    increase: "1.3%",
  },
];

const categoryColors = {
  Feeds: "bg-green-100 text-green-800",
  Vegetable: "bg-yellow-100 text-yellow-800",
  "Instant Food": "bg-purple-100 text-purple-800",
  Household: "bg-blue-100 text-blue-800",
};

const BestSellingProductCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Best Selling Product
        </h2>
        <button className="text-sm text-blue-600 hover:underline">See All</button>
      </div>

      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-4 py-3">Product</th>
            <th scope="col" className="px-4 py-3">Product ID</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Remaining Qty</th>
            <th scope="col" className="px-4 py-3">Turnover</th>
            <th scope="col" className="px-4 py-3">Increase By</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {bestSellingData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="flex items-center gap-2 px-4 py-3 font-medium text-gray-900">
                <FaBoxOpen className="text-blue-500" />
                {item.product}
              </td>
              <td className="px-4 py-3">{item.id}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categoryColors[item.category] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.category}
                </span>
              </td>
              <td className="px-4 py-3">{item.quantity}</td>
              <td className="px-4 py-3">{item.turnover}</td>
              <td className="px-4 py-3 text-green-600 font-medium">{item.increase}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSellingProductCard;
