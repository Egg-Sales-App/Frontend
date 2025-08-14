import React, { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import { useToast } from "../../components/ui/ToastContext";
import HybridFeedImage from "../../assets/hybridfeed.png";
import HalfDozenEggsImage from "../../assets/eggcrate.png";
import DayOldChicksImage from "../../assets/dayoldchicks.png";
import EquipmentImage from "../../assets/equipment.png";
import FeederImage from "../../assets/feeder.png";
import BroilerEquipmentImage from "../../assets/broilerequipment.png";
import DewormerImage from "../../assets/dewormer.png";
import ChickenFeedImage from "../../assets/chicken_feed.png";
import AddProduct from "../../components/ui/AddProduct";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all"); // New state for filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for view/edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // "view", "edit", or "add"
  const [formData, setFormData] = useState({});

  // Toast notifications
  const { success, error: showError, info } = useToast();

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

  // Extract unique categories from products and create category objects
  const extractCategoriesFromProducts = (productsData) => {
    const categoryMap = new Map();

    productsData.forEach((product) => {
      const categoryName = product.category;
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          id: categoryMap.size + 1,
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
      if (product.stock < 10) {
        category.lowStockItems += 1;
      }
    });

    return Array.from(categoryMap.values());
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching products from API...");

        // Fetch products from backend API
        const response = await inventoryService.getProducts({
          page: 1,
          limit: 100, // Get all products for now
        });

        console.log("📦 API Response:", response);

        // inventoryService now handles response format normalization
        const productsArray = response.products || [];

        console.log("📦 Products to map:", productsArray);

        // Map API response to component format
        const mappedProducts = productsArray.map((product) => ({
          id: product.id,
          name: product.name,
          category:
            product.category === "Feed" ? "Feed & Nutrition" : product.category, // Normalize category
          categoryId: getCategoryIdByName(product.category),
          stock: product.quantity_in_stock,
          img: getProductImage(product.category, product.name), // Dynamic image selection
          price: parseFloat(product.price) || 0,
          cost: parseFloat(product.price) * 0.8 || 0, // Estimate cost as 80% of price
          sku: product.sku,
          description: product.description,
          weeklySales: Math.floor(Math.random() * 20), // Mock weekly sales for now
          isTopSelling: Math.random() > 0.7, // Mock top selling status
          unit: product.unit,
          expiryDate: product.expiry_date,
          supplier: product.supplier?.name || "Unknown", // Handle supplier object
          supplierDetails: product.supplier, // Keep full supplier info
          dateAdded: product.date_added,
        }));

        console.log("✅ Mapped products:", mappedProducts);

        // Extract categories from products
        const extractedCategories =
          extractCategoriesFromProducts(mappedProducts);
        console.log("📂 Extracted categories:", extractedCategories);

        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setCategories(extractedCategories);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError(err.message);
        setLoading(false);

        // Fallback to mock data if API fails
        console.log("🔄 Falling back to mock data...");
        const fallbackCategories = extractCategoriesFromProducts(
          mockInventoryData.products
        );
        setProducts(mockInventoryData.products);
        setFilteredProducts(mockInventoryData.products);
        setCategories(fallbackCategories);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and additional filters
  useEffect(() => {
    let baseProducts = products;

    // First filter by category
    if (selectedCategory !== "all") {
      baseProducts = products.filter((product) => {
        // Handle mapping between API categories and UI categories
        if (selectedCategory === "Feed & Nutrition") {
          return (
            product.category === "Feed & Nutrition" ||
            product.category === "Feed"
          );
        }
        return product.category === selectedCategory;
      });
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
      // Find category from dynamic categories instead of mock data
      const categoryData = categories.find(
        (cat) => cat.name === selectedCategory
      );

      // Calculate real-time data for selected category from API products
      const categoryProducts = products.filter((p) => {
        // Handle mapping between API categories and UI categories
        if (selectedCategory === "Feed & Nutrition") {
          return p.category === "Feed & Nutrition" || p.category === "Feed";
        }
        return p.category === selectedCategory;
      });

      return {
        name: selectedCategory,
        id: categoryData?.id || 1,
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

  // Modal handlers
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("view");
    document.getElementById("product_details_modal").showModal();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    info("You can now edit the product details");
    document.getElementById("product_details_modal").showModal();
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log("🗑️ Deleting product:", productId);

        // Call delete API
        await inventoryService.deleteProduct(productId);

        // Remove product from local state
        setProducts(products.filter((p) => p.id !== productId));

        // Close modal
        closeModal();

        console.log("✅ Product deleted successfully");
        success("Product deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting product:", error);
        showError(`Failed to delete product: ${error.message}`);
      }
    }
  };

  const closeModal = () => {
    if (modalMode === "edit" && Object.keys(formData).length > 0) {
      // User was editing and has unsaved changes
      info("Changes discarded");
    }
    setSelectedProduct(null);
    setModalMode("view");
    setFormData({});
    document.getElementById("product_details_modal").close();
  };

  // Handle saving product changes (for edit mode)
  const handleSaveProductChanges = async () => {
    try {
      console.log("💾 Saving product changes...", formData);
      console.log("📝 Selected product:", selectedProduct);

      // Validate required fields
      const productName = formData.name || selectedProduct.name;
      const productPrice = formData.price || selectedProduct.price;
      const productStock = formData.stock || selectedProduct.stock;

      if (!productName || !productPrice || productStock === undefined) {
        showError("Please fill in all required fields (name, price, stock)");
        return;
      }

      // Construct supplier object if any supplier data is provided
      const supplierData = {
        name: formData.supplier || selectedProduct.supplier,
        contact_email: selectedProduct.supplierDetails?.contact_email || "",
        contact_phone:
          formData.supplierContact ||
          selectedProduct.supplierDetails?.contact_phone ||
          "",
        address:
          formData.supplierAddress ||
          selectedProduct.supplierDetails?.address ||
          "",
      };

      // Prepare data for API
      const updateData = {
        name: productName,
        description: formData.description || selectedProduct.description,
        category: formData.category || selectedProduct.category,
        price: productPrice,
        quantity_in_stock: parseInt(productStock),
        sku: formData.sku || selectedProduct.sku,
        unit: selectedProduct.unit || "unit",
        expiry_date: formData.expiryDate || selectedProduct.expiryDate,
        supplier: supplierData,
        supplier_id: selectedProduct.supplierDetails?.id || 0,
      };

      console.log("🚀 Sending update to API:", updateData);

      // Call update API
      const response = await inventoryService.updateProduct(
        selectedProduct.id,
        updateData
      );

      console.log("✅ Update response:", response);

      // Update the product in local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
                name: updateData.name,
                description: updateData.description,
                category: updateData.category,
                price: parseFloat(updateData.price),
                stock: parseInt(updateData.quantity_in_stock),
                sku: updateData.sku,
                unit: updateData.unit,
                expiryDate: updateData.expiry_date,
                supplier: updateData.supplier?.name || "Unknown",
                supplierDetails: updateData.supplier,
              }
            : product
        )
      );

      // Close modal
      closeModal();

      console.log("✅ Product updated successfully");
      success("Product updated successfully!");
    } catch (error) {
      console.error("❌ Error updating product:", error);
      showError(`Failed to update product: ${error.message}`);
    }
  };

  // Handle product save
  const handleProductSave = async (productData) => {
    try {
      console.log("💾 Saving new product:", productData);

      // Map component data to API format
      const apiProductData = {
        name: productData.name,
        description: productData.description || "",
        category: productData.category,
        price: productData.buyingPrice || productData.price,
        quantity_in_stock: parseInt(productData.stock) || 0,
        sku: productData.sku || `SKU-${Date.now()}`,
        unit: productData.unit || "unit",
        expiry_date: productData.expiryDate || null,
        supplier_id: null, // No supplier selection in form yet
      };

      console.log("🚀 Sending to API:", apiProductData);

      // Create product via API
      const response = await inventoryService.createProduct(apiProductData);

      console.log("✅ API Response:", response);

      // Map the new product to component format
      const newProduct = {
        id: response.product.id,
        name: response.product.name,
        category: response.product.category,
        categoryId: getCategoryIdByName(response.product.category),
        stock: response.product.quantity_in_stock,
        img: HybridFeedImage, // Default image
        price: parseFloat(response.product.price) || 0,
        cost: parseFloat(response.product.price) * 0.8 || 0, // Estimate cost
        sku: response.product.sku,
        description: response.product.description,
        weeklySales: 0,
        isTopSelling: false,
        unit: response.product.unit,
        expiryDate: response.product.expiry_date,
        supplier: response.product.supplier,
        dateAdded: response.product.date_added,
      };

      // Add to products list
      setProducts((prevProducts) => [...prevProducts, newProduct]);

      // Close modal
      handleProductModalClose();

      console.log("✅ Product added successfully:", newProduct);
      success("Product added successfully!");
    } catch (error) {
      console.error("❌ Error saving product:", error);
      showError(`Failed to save product: ${error.message}`);
    }
  };

  // Handle modal close
  const handleProductModalClose = () => {
    const modal = document.getElementById("add_product_modal");
    if (modal) {
      modal.close();
    }
  };

  // Helper function to get category ID by name
  const getCategoryIdByName = (categoryName) => {
    // First try to find in dynamic categories
    const dynamicCategory = categories.find((cat) => cat.name === categoryName);
    if (dynamicCategory) {
      return dynamicCategory.id;
    }

    // Fallback to static mapping
    const categoryMap = {
      "Feed & Nutrition": 1,
      "Day Old Chick": 2,
      Equipment: 3,
      Feed: 1, // Map API category "Feed" to "Feed & Nutrition"
    };
    return categoryMap[categoryName] || 1;
  };

  // Get categories with dynamic product counts from API data
  const getCategoriesWithCounts = () => {
    return categories.map((category) => {
      const categoryProducts = products.filter(
        (p) =>
          p.category === category.name ||
          (category.name === "Feed & Nutrition" && p.category === "Feed")
      );

      return {
        ...category,
        totalProducts: categoryProducts.length,
      };
    });
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
          onClick={() => handleEditProduct(product)}
          className="btn btn-sm btn-outline text-gray-500"
        >
          Edit
        </button>
        <button
          onClick={() => handleViewProduct(product)}
          className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
        >
          View
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
          <h3 className="text-lg font-semibold mb-1 text-gray-600">
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
            {getCategoriesWithCounts().map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={selectedCategory === category.name}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
        {/* Add buttons */}
        <div className="flex gap-3">
          <button
            className="btn btn-outline text-gray-500"
            onClick={() =>
              document.getElementById("add_product_modal").showModal()
            }
          >
            Add Product
          </button>
          <button className="btn bg-blue-500 text-gray-100 hover:bg-blue-600 font-medium">
            Add Category
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

      {/* Product Details Modal */}
      <dialog id="product_details_modal" className="modal text-black">
        <div className="modal-box bg-white max-w-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>

          {selectedProduct && (
            <>
              <h3 className="text-2xl mb-4">
                {modalMode === "view" ? "Product Details" : "Edit Product"}
              </h3>

              <div className="space-y-4">
                {/* Product Image */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
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
                </div>

                {/* Product Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.name}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={formData.name || selectedProduct.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.category}
                      </p>
                    ) : (
                      <select
                        value={formData.category || selectedProduct.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        GHS {selectedProduct.price}
                      </p>
                    ) : (
                      <input
                        type="number"
                        value={formData.price || selectedProduct.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                        step="0.01"
                      />
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.description}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={
                          formData.description || selectedProduct.description
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.stock}
                      </p>
                    ) : (
                      <input
                        type="number"
                        value={formData.stock || selectedProduct.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.sku}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={formData.sku || selectedProduct.sku}
                        onChange={(e) =>
                          setFormData({ ...formData, sku: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Added
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.dateAdded
                          ? new Date(selectedProduct.dateAdded).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </p>
                    ) : (
                      <input
                        type="text"
                        defaultValue={selectedProduct.dateAdded}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.expiryDate
                          ? new Date(
                              selectedProduct.expiryDate
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    ) : (
                      <input
                        type="date"
                        value={
                          formData.expiryDate || selectedProduct.expiryDate
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expiryDate: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.supplier || "N/A"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={
                          formData.supplier || selectedProduct.supplier || ""
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, supplier: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier's Address
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.supplierDetails?.address || "N/A"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={
                          formData.supplierAddress ||
                          selectedProduct.supplierDetails?.address ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            supplierAddress: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier's Contact
                    </label>
                    {modalMode === "view" ? (
                      <p className="p-2 bg-gray-50 rounded">
                        {selectedProduct.supplierDetails?.contact_phone ||
                          "N/A"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        value={
                          formData.supplierContact ||
                          selectedProduct.supplierDetails?.contact_phone ||
                          ""
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            supplierContact: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  {modalMode === "view" ? (
                    <>
                      <button
                        onClick={() => setModalMode("edit")}
                        className="btn bg-blue-500 hover:bg-blue-600 text-white flex-1"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(selectedProduct.id)}
                        className="btn bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={closeModal}
                        className="btn btn-outline flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProductChanges}
                        className="btn bg-green-500 hover:bg-green-600 text-white flex-1"
                      >
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
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
          <button
            className="btn btn-primary mt-4"
            onClick={() =>
              document.getElementById("add_product_modal").showModal()
            }
          >
            Add Product
          </button>
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
    </>
  );
};

export default Inventory;
