import React, { useState, useEffect } from "react";
import { inventoryService } from "../../../services/inventoryService";
import { supplierService } from "../../../services/supplierService";
import { categoryService } from "../../../services/categoryService";
import EquipmentImage from "../../../assets/equipment.png";
import FeederImage from "../../../assets/feeder.png";
import BroilerEquipmentImage from "../../../assets/broilerequipment.png";
import HybridFeedImage from "../../../assets/hybridfeed.png";
import DayOldChicksImage from "../../../assets/dayoldchicks.png";
import DewormerImage from "../../../assets/dewormer.png";
import ChickenFeedImage from "../../../assets/chicken_feed.png";
import HalfDozenEggsImage from "../../../assets/eggcrate.png";
import AddProduct from "../../../components/ui/AddProduct";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // or solid if you prefer
import CheckoutCard from "../../../components/ui/CheckoutCard";
import { useToast } from "../../../components/ui/ToastContext";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all"); // New state for filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  // Add toast functionality
  const { success, error: showError, warning, info } = useToast();

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

  // Helper function to map category names to IDs (Equipment focused)
  const getCategoryIdByName = (categoryName, apiCategories = []) => {
    // First, try to find the category in the API categories
    if (apiCategories && apiCategories.length > 0) {
      const found = apiCategories.find(
        (cat) =>
          cat.name &&
          cat.name.toLowerCase() === (categoryName || "").toLowerCase()
      );
      if (found) {
        return found.id;
      }
    }

    // Fallback to static mapping for equipment categories
    const categoryMap = {
      Equipment: 3,
      "Broiler Equipment": 4,
      "Feeding Equipment": 5,
      "Poultry Equipment": 6,
      // Legacy mappings for any mixed data
      Feed: 1,
      "Feed & Nutrition": 1,
      "Day Old Chick": 2,
      Chicks: 2,
      Nutrition: 1,
    };

    // Try exact match first
    if (categoryMap[categoryName]) {
      return categoryMap[categoryName];
    }

    // Try case-insensitive match
    const categoryStr = (categoryName || "").toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (key.toLowerCase() === categoryStr) {
        return value;
      }
    }

    // Default to Equipment category for equipment store
    return 3;
  };

  // Helper function to extract categories from products
  const extractCategoriesFromProducts = (products, apiCategories = []) => {
    const categoryMap = new Map();

    products.forEach((product) => {
      const categoryName = product.category;
      const categoryId = getCategoryIdByName(categoryName, apiCategories);

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: categoryId,
          name: categoryName,
          totalProducts: 0,
          totalValue: 0,
          lastWeekSales: 0,
          lowStockItems: 0,
        });
      }

      const category = categoryMap.get(categoryName);
      category.totalProducts += 1;
      category.totalValue += product.price * product.stock;
      category.lastWeekSales += product.weeklySales || 0;
      if (product.stock < 10) category.lowStockItems += 1;
    });

    return Array.from(categoryMap.values());
  };

  // Helper function to get appropriate image for product
  const getProductImage = (category, productName) => {
    const name = productName.toLowerCase();
    const cat = category.toLowerCase();

    // Drug/Medicine products
    if (
      cat.includes("drug") ||
      name.includes("dewormer") ||
      name.includes("medicine")
    ) {
      return DewormerImage;
    }

    // Equipment products
    if (
      cat.includes("equipment") ||
      name.includes("feeder") ||
      name.includes("broiler")
    ) {
      if (name.includes("feeder")) return FeederImage;
      if (name.includes("broiler")) return BroilerEquipmentImage;
      return EquipmentImage;
    }

    // Feed products
    if (
      cat.includes("feed") ||
      cat.includes("nutrition") ||
      name.includes("feed")
    ) {
      if (
        name.includes("chicken") ||
        name.includes("starter") ||
        name.includes("layer")
      ) {
        return ChickenFeedImage;
      }
      return HybridFeedImage;
    }

    // Egg products
    if (cat.includes("egg") || name.includes("egg")) {
      return HalfDozenEggsImage;
    }

    // Chick products
    if (cat.includes("chick") || name.includes("chick")) {
      return DayOldChicksImage;
    }

    // Default fallback based on category
    switch (cat) {
      case "drugs":
        return DewormerImage;
      case "equipment":
        return EquipmentImage;
      case "feed":
      case "nutrition":
        return HybridFeedImage;
      case "eggs":
        return HalfDozenEggsImage;
      case "chicks":
        return DayOldChicksImage;
      default:
        return HybridFeedImage; // Default fallback
    }
  };

  // Enhanced mock data with equipment categories only (fallback only)
  const mockInventoryData = {
    categories: [
      {
        id: 3,
        name: "Equipment",
        totalProducts: 3,
        totalValue: 4255,
        lastWeekSales: 3,
        lowStockItems: 1,
      },
      {
        id: 4,
        name: "Broiler Equipment",
        totalProducts: 2,
        totalValue: 2800,
        lastWeekSales: 2,
        lowStockItems: 0,
      },
      {
        id: 5,
        name: "Feeding Equipment",
        totalProducts: 2,
        totalValue: 1800,
        lastWeekSales: 1,
        lowStockItems: 1,
      },
    ],
    products: [
      // Equipment Category
      {
        id: 10,
        name: "Feeders",
        category: "Equipment",
        categoryId: 3,
        stock: 15,
        img: FeederImage,
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
        categoryId: 3,
        stock: 8,
        img: EquipmentImage,
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
        categoryId: 3,
        stock: 2,
        img: EquipmentImage,
        price: 1500,
        cost: 1200,
        sku: "IN-001",
        description: "Automatic egg incubators",
        weeklySales: 1,
        isTopSelling: false,
      },
      {
        id: 13,
        name: "Broiler Equipment Set",
        category: "Broiler Equipment",
        categoryId: 4,
        stock: 5,
        img: BroilerEquipmentImage,
        price: 800,
        cost: 600,
        sku: "BE-001",
        description: "Complete broiler equipment package",
        weeklySales: 2,
        isTopSelling: true,
      },
      {
        id: 14,
        name: "Heating Lamps",
        category: "Broiler Equipment",
        categoryId: 4,
        stock: 12,
        img: EquipmentImage,
        price: 45,
        cost: 30,
        sku: "HL-001",
        description: "Infrared heating lamps for chicks",
        weeklySales: 8,
        isTopSelling: true,
      },
      {
        id: 15,
        name: "Feeding Troughs",
        category: "Feeding Equipment",
        categoryId: 5,
        stock: 20,
        img: FeederImage,
        price: 35,
        cost: 25,
        sku: "FT-001",
        description: "Plastic feeding troughs",
        weeklySales: 5,
        isTopSelling: false,
      },
      {
        id: 16,
        name: "Water Bottles",
        category: "Feeding Equipment",
        categoryId: 5,
        stock: 8,
        img: EquipmentImage,
        price: 25,
        cost: 18,
        sku: "WB-001",
        description: "Portable water bottles for poultry",
        weeklySales: 3,
        isTopSelling: false,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching data from API...");

        // Fetch products, suppliers, and categories in parallel (same as admin inventory)
        const [productsResponse, suppliersResponse, categoriesResponse] =
          await Promise.all([
            inventoryService.getProducts({
              page: 1,
              limit: 100, // Get all products for now
            }),
            supplierService.getSuppliers({
              page: 1,
              limit: 100, // Get all suppliers
            }),
            categoryService.getCategories(),
          ]);

        console.log("📦 Products API Response:", productsResponse);
        console.log("👥 Suppliers API Response:", suppliersResponse);
        console.log("📂 Categories API Response:", categoriesResponse);

        // Handle products
        const productsArray =
          productsResponse.products || productsResponse || [];
        console.log("📦 Products to map:", productsArray);

        // Log the first few products to understand the data structure
        if (productsArray.length > 0) {
          console.log(
            "🔍 First product structure:",
            JSON.stringify(productsArray[0], null, 2)
          );
          console.log(
            "🔍 All product names and categories:",
            productsArray.map((p) => ({
              name: p.name,
              category: p.category?.name || p.category,
              id: p.id,
            }))
          );
        }

        // Handle suppliers
        const suppliersArray =
          suppliersResponse.suppliers || suppliersResponse || [];
        console.log("👥 Suppliers to set:", suppliersArray);

        // Handle categories
        const categoriesArray =
          categoriesResponse.categories || categoriesResponse || [];
        console.log("📂 API Categories:", categoriesArray);

        // For equipment store: Filter to only show equipment-related products
        // This is a comprehensive filter that checks multiple criteria
        const mappedProducts = productsArray
          .filter((product) => {
            // Get category name from different possible structures
            const categoryName =
              product.category?.name || product.category || "";
            const categoryStr = categoryName.toLowerCase();

            // Get product name
            const productName = (product.name || "").toLowerCase();

            // Define equipment keywords to look for
            const equipmentKeywords = [
              "equipment",
              "feeder",
              "broiler",
              "incubator",
              "heating",
              "lamp",
              "dispenser",
              "trough",
              "waterer",
              "cage",
              "coop",
              "perch",
              "nest",
              "roost",
              "ventilation",
              "fan",
              "heater",
              "thermometer",
            ];

            // Check if category or product name contains equipment keywords
            const isEquipment = equipmentKeywords.some(
              (keyword) =>
                categoryStr.includes(keyword) || productName.includes(keyword)
            );

            // Log filtering decision
            console.log(
              `${isEquipment ? "✅" : "❌"} Product: "${
                product.name
              }" | Category: "${categoryName}" | Equipment: ${isEquipment}`
            );

            return isEquipment;
          })
          .map((product) => {
            // Get and normalize category name
            const originalCategory =
              product.category?.name || product.category || "Equipment";
            let normalizedCategory = originalCategory;

            // Normalize some common category names to equipment types
            if (originalCategory.toLowerCase().includes("feeder")) {
              normalizedCategory = "Feeding Equipment";
            } else if (originalCategory.toLowerCase().includes("broiler")) {
              normalizedCategory = "Broiler Equipment";
            } else if (originalCategory.toLowerCase().includes("incubator")) {
              normalizedCategory = "Equipment";
            } else if (!originalCategory.toLowerCase().includes("equipment")) {
              // If it doesn't contain 'equipment' but made it through the filter,
              // it's probably equipment, so normalize it
              normalizedCategory = "Equipment";
            }

            return {
              id: product.id,
              name: product.name,
              category: normalizedCategory,
              categoryId: getCategoryIdByName(
                normalizedCategory,
                categoriesArray
              ),
              stock: product.quantity_in_stock || 0,
              img: getProductImage(normalizedCategory, product.name), // Dynamic image selection
              price: parseFloat(product.price) || 0,
              cost: parseFloat(product.price) * 0.8 || 0, // Estimate cost as 80% of price
              sku: product.sku || `SKU-${product.id}`,
              description: product.description || "",
              weeklySales: Math.floor(Math.random() * 20), // Mock weekly sales for now
              isTopSelling: Math.random() > 0.7, // Mock top selling status
              unit: product.unit || "pcs",
              expiryDate: product.expiry_date,
              supplier: product.supplier?.name || "Unknown", // Handle supplier object
              supplierDetails: product.supplier, // Keep full supplier info
              dateAdded: product.date_added,
            };
          });

        console.log("✅ Mapped equipment products:", mappedProducts);

        // Extract categories from equipment products
        const extractedCategories = extractCategoriesFromProducts(
          mappedProducts,
          categoriesArray
        );
        console.log("📂 Extracted equipment categories:", extractedCategories);

        // Set all state
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setSuppliers(suppliersArray);
        setApiCategories(categoriesArray);
        setCategories(extractedCategories);
        setLoading(false);

        console.log("✅ Equipment store data loaded successfully!");
        success("Equipment inventory loaded successfully!", 3000);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
        setLoading(false);

        showError(`Failed to load inventory: ${err.message}`, 5000);

        // Fallback to mock data if API fails
        console.log("📋 Falling back to equipment mock data...");
        warning("Using offline data - some features may be limited", 4000);
        setProducts(mockInventoryData.products);
        setFilteredProducts(mockInventoryData.products);
        setCategories(mockInventoryData.categories);
        setSuppliers([]);
        setApiCategories([]);
      }
    };

    fetchData();
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
      const categoryData = categories.find(
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

  // Product handling functions
  const handleProductSave = async (productData) => {
    try {
      console.log("Adding new product:", productData);

      // Get default image based on equipment type
      const getDefaultImage = () => {
        const imageName = productData.name.toLowerCase();
        if (imageName.includes("feeder")) return FeederImage;
        if (imageName.includes("equipment")) return EquipmentImage;
        if (imageName.includes("broiler")) return BroilerEquipmentImage;
        return EquipmentImage; // Default fallback
      };

      // Create new product with proper structure
      const newProduct = {
        id: Date.now(), // Temporary ID
        name: productData.name,
        category: productData.category,
        categoryId: getCategoryIdByName(productData.category, apiCategories),
        stock: parseInt(productData.stock) || 0,
        price: parseFloat(productData.price) || 0,
        cost: parseFloat(productData.cost) || 0,
        sku: productData.sku || `SKU-${Date.now()}`,
        description: productData.description || "",
        img: getDefaultImage(),
        weeklySales: 0,
        isTopSelling: false,
      };

      // Add to products list
      setProducts((prev) => [...prev, newProduct]);

      // Close modal
      document.getElementById("add_product_modal").close();

      console.log("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleProductModalClose = () => {
    document.getElementById("add_product_modal").close();
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
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Products ({products.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.totalProducts})
              </button>
            ))}
          </div>
        </div>
        {/* Checkout Button with Cart Icon */}
        <div className="flex items-center gap-3">
          {/* Toast Test Buttons (for development) */}
          {import.meta.env.MODE === "development" && (
            <div className="flex gap-2">
              <button
                onClick={() => success("Test success message!")}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                title="Test Success Toast"
              >
                ✓
              </button>
              <button
                onClick={() => showError("Test error message!")}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                title="Test Error Toast"
              >
                ✗
              </button>
              <button
                onClick={() => warning("Test warning message!")}
                className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                title="Test Warning Toast"
              >
                ⚠
              </button>
              <button
                onClick={() => info("Test info message!")}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                title="Test Info Toast"
              >
                i
              </button>
            </div>
          )}

          <button
            onClick={handleCheckout} // define this function or link to your checkout route
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Checkout
          </button>
        </div>
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
          <AddProduct
            onSave={handleProductSave}
            onClose={handleProductModalClose}
            categories={categories.map((cat) => cat.name)}
          />
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
          <p className="text-gray-400 text-sm">Contact admin to get started.</p>
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
        <CheckoutCard
          items={cartItems}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
};

export default Inventory;
