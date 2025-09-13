import React, { useState, useEffect } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { inventoryService } from "../../services/inventoryService";
import { useToast } from "./ToastContext";
import { CATEGORY_COLORS } from "../../constants/constants";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

/**
 * BestSellingProductCard Component
 * --------------------------------
 * Displays the top-selling products in a table format.
 * - Fetches data from inventoryService
 * - Shows loading spinner while fetching
 * - Handles empty states gracefully
 * - Uses category color coding for better readability
 */
const BestSellingProductCard = () => {
  // ----- State Management -----
  const [bestSellingData, setBestSellingData] = useState([]); // API response data
  const [loading, setLoading] = useState(true); // Loading state
  const { error: showError } = useToast(); // Global toast error handler

  // ----- Data Fetching -----
  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoading(true);
        const response = await inventoryService.getTopSellingProducts(5);

        // Validate response format
        if (response && Array.isArray(response)) {
          setBestSellingData(response);
        } else {
          setBestSellingData([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch best selling products:", error);
        showError?.("Failed to load best selling products");
        setBestSellingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, [showError]);

  // ----- Utility: Category Badge Color -----
  const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
  };

  // ----- UI States -----
  if (loading) {
    // While fetching data
    return (
      <div className="bg-white rounded-lg shadow p-6 w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Best Selling Products
          </h2>
        </div>
        <LoadingSpinner
          size="lg"
          message="Loading best selling products..."
          className="h-48"
        />
      </div>
    );
  }

  if (!bestSellingData || bestSellingData.length === 0) {
    // No data available
    return (
      <div className="bg-white rounded-lg shadow p-6 w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Best Selling Products
          </h2>
        </div>
        <EmptyState type="TOP_SELLING_PRODUCTS" className="h-48" />
      </div>
    );
  }

  // ----- Main Render -----
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Best Selling Product
        </h2>
        <button className="text-sm text-blue-600 hover:underline">
          See All
        </button>
      </div>

      {/* Data Table */}
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-4 py-3">Product</th>
            <th scope="col" className="px-4 py-3">Product ID</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Sold Qty</th>
            <th scope="col" className="px-4 py-3">Remaining Qty</th>
            <th scope="col" className="px-4 py-3">Price</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {bestSellingData.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50">
              {/* Product Column */}
              <td className="flex items-center gap-2 px-4 py-3 font-medium text-gray-900">
                <FaBoxOpen className="text-blue-500" />
                {item.name || item.product || "Unknown Product"}
              </td>

              {/* Product ID */}
              <td className="px-4 py-3">{item.id || "N/A"}</td>

              {/* Category Badge */}
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category || "General"}
                </span>
              </td>

              {/* Sales Data */}
              <td className="px-4 py-3">
                {item.soldQuantity || item.sold_quantity || 0}
              </td>
              <td className="px-4 py-3">
                {item.remainingQuantity ||
                  item.remaining_quantity ||
                  item.stock ||
                  0}
              </td>

              {/* Price */}
              <td className="px-4 py-3">GHS {item.price || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSellingProductCard;
