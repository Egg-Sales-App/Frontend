import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { inventoryService } from "../../services/inventoryService";
import HybridFeedImage from "../../assets/hybridfeed.png";
import HalfDozenEggsImage from "../../assets/eggcrate.png";
import DayOldChicksImage from "../../assets/dayoldchicks.png";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced mock data with categories
  const mockInventoryData = {
    categories: [
      {
        id: 1,
        name: "Feed & Nutrition",
        totalProducts: 15,
        totalValue: 25000,
        lastWeekSales: 3,
        lowStockItems: 2,
      },
      {
        id: 2,
        name: "Day Old Chick",
        totalProducts: 25,
        totalValue: 35000,
        lastWeekSales: 8,
        lowStockItems: 0,
      },
      {
        id: 3,
        name: "Equipment",
        totalProducts: 12,
        totalValue: 18000,
        lastWeekSales: 2,
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
      },

      //  Category
      {
        id: 4,
        name: "Half Dozen Eggs",
        category: "",
        categoryId: 2,
        stock: 7,
        img: HalfDozenEggsImage,
        price: 30,
        cost: 20,
        sku: "EG-006",
        description: "Fresh farm eggs - 6 pieces",
      },
      {
        id: 5,
        name: "Dozen Eggs",
        category: "",
        categoryId: 2,
        stock: 15,
        img: HalfDozenEggsImage,
        price: 55,
        cost: 35,
        sku: "EG-012",
        description: "Fresh farm eggs - 12 pieces",
      },
      {
        id: 6,
        name: "Farm Fresh Milk",
        category: "",
        categoryId: 2,
        stock: 3,
        img: HalfDozenEggsImage,
        price: 45,
        cost: 30,
        sku: "MK-001",
        description: "Fresh dairy milk - 1 liter",
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

  // Filter products by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

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
          (sum, product) => sum + Math.floor(Math.random() * 10),
          0
        ),
        lowStockItems: products.filter((product) => product.stock < 10).length,
      };
    } else {
      const categoryData = mockInventoryData.categories.find(
        (cat) => cat.name === selectedCategory
      );
      return categoryData || {};
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const ProductCard = ({ product }) => (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-between transition-transform hover:scale-105">
      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
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
        <p
          className={`text-sm mb-2 ${
            product.stock < 10 ? "text-red-600" : "text-green-600"
          }`}
        >
          {product.stock} In-stock
        </p>
        {product.price && (
          <p className="text-blue-600 font-medium">GHS {product.price}</p>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="btn btn-sm btn-outline">Edit</button>
        <button className="btn btn-sm btn-primary">View</button>
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

  if (loading) {
    return (
      <AdminLayout title="Inventory">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Inventory">
        <div className="alert alert-error">
          <span>Error loading products: {error}</span>
        </div>
      </AdminLayout>
    );
  }

  const currentCategoryData = getCurrentCategoryData();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-600">
            Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products ({products.length})
            </button>
            {mockInventoryData.categories.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={selectedCategory === category.name}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline text-gray-500">Add Product</button>
          <button className="btn btn-primary">Add Category</button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mb-6 p-6 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl text-black font-semibold mb-4">
          {currentCategoryData.name} Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <h3 className="text-blue-500 text-sm font-medium mb-2">
              Total Products
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentCategoryData.totalProducts}
            </p>
            <p className="text-gray-500 text-xs">Active items</p>
          </div>

          <div className="text-center">
            <h3 className="text-blue-500 text-sm font-medium mb-2">
              Total Value
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              GHS{" "}
              {currentCategoryData.totalValue?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-gray-500 text-xs">Inventory worth</p>
          </div>

          <div className="text-center">
            <h3 className="text-blue-500 text-sm font-medium mb-2">
              Weekly Sales
            </h3>
            <p className="text-2xl font-bold text-gray-800">
              {currentCategoryData.lastWeekSales}
            </p>
            <p className="text-gray-500 text-xs">Last 7 days</p>
          </div>

          <div className="text-center">
            <h3 className="text-blue-500 text-sm font-medium mb-2">
              Low Stock
            </h3>
            <p
              className={`text-2xl font-bold ${
                currentCategoryData.lowStockItems > 0
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {currentCategoryData.lowStockItems}
            </p>
            <p className="text-gray-500 text-xs">Items below 10</p>
          </div>
        </div>
      </div>

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
    </AdminLayout>
  );
};

export default Inventory;
