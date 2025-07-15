import React, { useState, useEffect } from "react";
import { inventoryService } from "../../../services/inventoryService";
import HybridFeedImage from "../../../assets/hybridfeed.png";
import HalfDozenEggsImage from "../../../assets/eggcrate.png";
import DayOldChicksImage from "../../../assets/dayoldchicks.png";
import AddProduct from "../../../components/ui/AddProduct";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // or solid if you prefer
import CheckoutCard from "../../../components/ui/CheckoutCard";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all"); // New state for filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);


  const handleCheckout = () => {
  setShowCheckout(true);
  console.log("Checkout clicked!");
};

const handleAddToCart = (product) => {
  // Check if already in cart
  const exists = cartItems.find((item) => item.id === product.id);
  if (!exists) {
    setCartItems((prev) => [...prev, product]);
  }
};


  // Enhanced mock data with categories and sales data
  const mockInventoryData = {
    categories: [
      {
        id: 1,
        name: "Feed & Nutrition",
        totalProducts: 3,
        totalValue: 2575,
        lastWeekSales: 8,
        lowStockItems: 1,
      },
      {
        id: 2,
        name: "Day Old Chick",
        totalProducts: 3,
        totalValue: 9040,
        lastWeekSales: 15,
        lowStockItems: 1,
      },
      {
        id: 3,
        name: "Equipment",
        totalProducts: 3,
        totalValue: 4255,
        lastWeekSales: 3,
        lowStockItems: 1,
      },
    ],
    products: [
      // Feed & Nutrition Category
      {
        id: 1,
        name: "Hybrid Feed Premium",
        category: "Feed & Nutrition",
        categoryId: 1,
        stock: 10,
        img: HybridFeedImage,
        price: 150,
        cost: 120,
        sku: "HF-001",
        description: "Premium quality hybrid feed for optimal nutrition",
        weeklySales: 5,
        isTopSelling: true,
      },
      {
        id: 2,
        name: "Starter Feed",
        category: "Feed & Nutrition",
        categoryId: 1,
        stock: 25,
        img: HybridFeedImage,
        price: 180,
        cost: 140,
        sku: "SF-001",
        description: "Specially formulated for young chicks",
        weeklySales: 12,
        isTopSelling: true,
      },
      {
        id: 3,
        name: "Layer Feed",
        category: "Feed & Nutrition",
        categoryId: 1,
        stock: 5,
        img: HybridFeedImage,
        price: 160,
        cost: 130,
        sku: "LF-001",
        description: "High calcium feed for laying hens",
        weeklySales: 3,
        isTopSelling: false,
      },

      // Day Old Chick Category
      {
        id: 7,
        name: "Day Old Chicks",
        category: "Day Old Chick",
        categoryId: 3,
        stock: 8,
        img: DayOldChicksImage,
        price: 5,
        cost: 3,
        sku: "CH-001",
        description: "Healthy day-old chicks",
        weeklySales: 20,
        isTopSelling: true,
      },
      {
        id: 8,
        name: "Broiler Chickens",
        category: "Day Old Chick",
        categoryId: 3,
        stock: 20,
        img: DayOldChicksImage,
        price: 250,
        cost: 180,
        sku: "BR-001",
        description: "Ready-to-sell broiler chickens",
        weeklySales: 8,
        isTopSelling: true,
      },
      {
        id: 9,
        name: "Layer Hens",
        category: "Day Old Chick",
        categoryId: 3,
        stock: 12,
        img: DayOldChicksImage,
        price: 300,
        cost: 220,
        sku: "LH-001",
        description: "Productive laying hens",
        weeklySales: 4,
        isTopSelling: false,
      },

      // Equipment Category
      {
        id: 10,
        name: "Feeders",
        category: "Equipment",
        categoryId: 4,
        stock: 15,
        img: HybridFeedImage,
        price: 75,
        cost: 50,
        sku: "FD-001",
        description: "Automatic chicken feeders",
        weeklySales: 6,
        isTopSelling: true,
      },
      {
        id: 11,
        name: "Water Dispensers",
        category: "Equipment",
        categoryId: 4,
        stock: 8,
        img: HybridFeedImage,
        price: 85,
        cost: 60,
        sku: "WD-001",
        description: "Gravity-fed water dispensers",
        weeklySales: 4,
        isTopSelling: false,
      },
      {
        id: 12,
        name: "Incubators",
        category: "Equipment",
        categoryId: 4,
        stock: 2,
        img: HybridFeedImage,
        price: 1500,
        cost: 1200,
        sku: "IN-001",
        description: "Automatic egg incubators",
        weeklySales: 1,
        isTopSelling: false,
      },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
          setProducts(mockInventoryData.products);
          setFilteredProducts(mockInventoryData.products);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and additional filters
  useEffect(() => {
    let baseProducts = products;

    // First filter by category
    if (selectedCategory !== "all") {
      baseProducts = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Then apply additional filters
    let finalProducts = baseProducts;

    switch (selectedFilter) {
      case "all":
        finalProducts = baseProducts;
        break;
      case "total-products":
        finalProducts = baseProducts; // Show all products in category
        break;
      case "total-value":
        // Sort by highest value (price * stock)
        finalProducts = [...baseProducts].sort(
          (a, b) => b.price * b.stock - a.price * a.stock
        );
        break;
      case "top-selling":
        // Show top selling products
        finalProducts = baseProducts.filter((product) => product.isTopSelling);
        break;
      case "low-stock":
        // Show low stock items
        finalProducts = baseProducts.filter((product) => product.stock < 10);
        break;
      default:
        finalProducts = baseProducts;
    }

    setFilteredProducts(finalProducts);
  }, [selectedCategory, selectedFilter, products]);

  // Get current category data for overview
  const getCurrentCategoryData = () => {
    if (selectedCategory === "all") {
      return {
        name: "All Products",
        totalProducts: products.length,
        totalValue: products.reduce(
          (sum, product) => sum + product.price * product.stock,
          0
        ),
        lastWeekSales: products.reduce(
          (sum, product) => sum + (product.weeklySales || 0),
          0
        ),
        lowStockItems: products.filter((product) => product.stock < 10).length,
        topSellingItems: products.filter((product) => product.isTopSelling)
          .length,
      };
    } else {
      const categoryData = mockInventoryData.categories.find(
        (cat) => cat.name === selectedCategory
      );

      // Calculate real-time data for selected category
      const categoryProducts = products.filter(
        (p) => p.category === selectedCategory
      );

      return {
        ...categoryData,
        totalProducts: categoryProducts.length,
        totalValue: categoryProducts.reduce(
          (sum, p) => sum + p.price * p.stock,
          0
        ),
        lastWeekSales: categoryProducts.reduce(
          (sum, p) => sum + (p.weeklySales || 0),
          0
        ),
        lowStockItems: categoryProducts.filter((p) => p.stock < 10).length,
        topSellingItems: categoryProducts.filter((p) => p.isTopSelling).length,
      };
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedFilter("all"); // Reset filter when changing category
  };

  const handleFilterClick = (filterType) => {
    setSelectedFilter(filterType);
  };

  // Get filter name for display
  const getFilterDisplayName = () => {
    switch (selectedFilter) {
      case "all":
        return "All Products";
      case "total-products":
        return "All Products";
      case "total-value":
        return "Highest Value Products";
      case "top-selling":
        return "Top Selling Products";
      case "low-stock":
        return "Low Stock Items";
      default:
        return "All Products";
    }
  };

  const ProductCard = ({ product }) => (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg px-3 pb-3 flex flex-col items-center justify-between transition-transform hover:scale-105 overflow-visible mt-8">
      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-transparent flex items-center justify-center -mt-10">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="hidden w-full h-full bg-gray-200 items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-1">{product.sku}</p>
        <div className="flex gap-2 items-center justify-center mb-2">
          <p
            className={`text-sm ${
              product.stock < 10 ? "text-red-600" : "text-green-600"
            }`}
          >
            {product.stock} In-stock
          </p>
          {product.isTopSelling && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              🔥 Top Seller
            </span>
          )}
        </div>
        {product.price && (
          <p className="text-blue-600 font-medium">GHS {product.price}</p>
        )}
        {product.weeklySales && (
          <p className="text-xs text-gray-500">
            {product.weeklySales} sold this week
          </p>
        )}
      </div>
      <div className="flex gap-2 mt-4">
  <button
  onClick={() => handleAddToCart(product)}
  className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
>
  Add to cart
</button>

</div>

    </div>
  );

  const CategoryButton = ({ category, isActive, onClick }) => (
    <button
      onClick={() => onClick(category.name)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {category.name} ({category.totalProducts})
    </button>
  );

  // Filter Card Component
  const FilterCard = ({ title, value, subtitle, filterType, icon }) => {
    const isActive = selectedFilter === filterType;

    return (
      <div
        onClick={() => handleFilterClick(filterType)}
        className={`text-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-blue-500 text-white shadow-lg transform scale-105"
            : "bg-white hover:bg-blue-50 hover:border-blue-200 border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-center">
          <span className="text-lg mr-2">{icon}</span>
          <h3
            className={`text-sm font-medium ${
              isActive ? "text-white" : "text-blue-500"
            }`}
          >
            {title}
          </h3>
        </div>
        <p
          className={`text-2xl font-bold ${
            isActive ? "text-white" : "text-gray-800"
          }`}
        >
          {value}
        </p>
        <p
          className={`text-xs ${isActive ? "text-blue-100" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner text-primary loading-lg"></div>
          <span className="ml-4 text-blue-400">Loading inventory...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="alert alert-error">
          <span>Error loading products: {error}</span>
        </div>
      </>
    );
  }

  const currentCategoryData = getCurrentCategoryData();

  return (
    <>
      {/* Header */}
      <div className="sticky top-15 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 z-10 py-2 px-2 mb-2 flex justify-between items-center">
        {/* Category Filter */}
        <div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Equipments ({products.length})
            </button>
           
          </div>
        </div>
          {/* Checkout Button with Cart Icon */}
  <button
    onClick={handleCheckout} // define this function or link to your checkout route
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    <ShoppingCartIcon className="h-5 w-5" />
    Checkout
  </button>
      </div>

      {/* Add Product Modal */}
      <dialog id="add_product_modal" className="modal text-black">
        <div className="modal-box bg-white max-w-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-2xl mb-4">New Product</h3>
          {/* AddProduct component will go here */}
          <AddProduct />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* Overview Stats */}
      <div className="mb-3 p-3 rounded-lg bg-gray-50 shadow-sm">
        <div className="flex justify-between items-center">
          {/* <h2 className="text-xl text-black font-semibold">
            {currentCategoryData.name} - {getFilterDisplayName()}
          </h2> */}
          {selectedFilter !== "all" && (
            <button
              onClick={() => setSelectedFilter("all")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FilterCard
            title="Total Products"
            value={currentCategoryData.totalProducts}
            subtitle="Active items"
            filterType="total-products"
            icon="📦"
          />

          <FilterCard
            title="Total Value"
            value={`GHS ${currentCategoryData.totalValue?.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }
            )}`}
            subtitle="Inventory worth"
            filterType="total-value"
            icon="💰"
          />

          <FilterCard
            title="Top Selling"
            value={currentCategoryData.topSellingItems || 0}
            subtitle="Best performers"
            filterType="top-selling"
            icon="🔥"
          />

          <FilterCard
            title="Low Stock"
            value={currentCategoryData.lowStockItems}
            subtitle="Items below 10"
            filterType="low-stock"
            icon="⚠️"
          />
        </div>
      </div>

      {/* Active Filter Indicator */}
      {selectedFilter !== "all" && (
        <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            Showing {getFilterDisplayName()}{" "}
            <span
              onClick={() => setSelectedFilter("all")}
              className="text-blue-600 cursor-pointer underline"
            >
              (Change)
            </span>
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-lg mb-2">
            {selectedCategory === "all"
              ? "No products found in inventory"
              : `No products found in ${selectedCategory} category`}
          </p>
          <p className="text-gray-400 text-sm">
            Add your first product to get started.
          </p>
          <button className="btn btn-primary mt-4">Add Product</button>
        </div>
      )}

      {/* Low Stock Alert */}
      {currentCategoryData.lowStockItems > 0 && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Low Stock Alert!</p>
              <p className="text-sm">
                {currentCategoryData.lowStockItems} items need restocking
              </p>
            </div>
          </div>
        </div>
      )}
      {showCheckout && (
  <CheckoutCard items={cartItems} onClose={() => setShowCheckout(false)} />
)}

    </>
  );
};

export default Inventory;
