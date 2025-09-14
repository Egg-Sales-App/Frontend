import React, { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventoryService";
import { supplierService } from "../../services/supplierService";
import { categoryService } from "../../services/categoryService";
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
import CategoryManagement from "../../components/ui/CategoryManagement";
import CategoryDropdown from "../../components/ui/CategoryDropdown";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching data from API...");

        // Test toast to verify system is working
        info("Loading inventory data...");

        // Fetch products, suppliers, and categories in parallel
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

        // Map API response to component format
        const mappedProducts = productsArray.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category?.name || product.category, // Handle nested category object
          categoryId: getCategoryIdByName(
            product.category?.name || product.category
          ),
          stock: product.quantity_in_stock,
          img: getProductImage(
            product.category?.name || product.category,
            product.name
          ), // Dynamic image selection
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

        // Handle suppliers
        const suppliersArray = suppliersResponse.suppliers || [];
        console.log("👥 Suppliers to set:", suppliersArray);

        // Handle categories from API
        const apiCategories = categoriesResponse.categories || [];
        console.log("📂 API Categories:", apiCategories);

        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setCategories(apiCategories);
        setSuppliers(suppliersArray);
        setLoading(false);

        // Show success message only if we have data
        // if (mappedProducts.length > 0) {
        //   info(
        //     `Loaded ${mappedProducts.length} products and ${suppliersArray.length} suppliers`
        //   );

        //   // Check for low stock items and notify
        //   const lowStockItems = mappedProducts.filter(
        //     (product) => product.stock < 10
        //   );
        //   if (lowStockItems.length > 0) {
        //     setTimeout(() => {
        //       showError(
        //         `⚠️ Warning: ${lowStockItems.length} product(s) have low stock (<10 units)`
        //       );
        //     }, 2000); // Show after 2 seconds to not overwhelm the user
        //   }
        // }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError(err.message);
        setLoading(false);
        showError(`Failed to load inventory data: ${err.message}`);

        // Fallback to empty data if API fails
        console.log("🔄 Setting empty data as fallback...");
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
        setSuppliers([]);
      }
    };

    fetchData();
  }, []);

  // Filter products by category and additional filters
  useEffect(() => {
    let baseProducts = products;

    // First filter by category
    if (selectedCategory !== "all") {
      baseProducts = products.filter((product) => {
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
      case "available-products":
        // Show all available products (in stock > 0)
        finalProducts = baseProducts.filter((product) => product.stock > 0);
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

    // Show informative toast for category changes
    if (categoryName === "all") {
      info(`Showing all ${products.length} products`);
    } else {
      const categoryProducts = products.filter((product) => {
        return product.category === categoryName;
      });
      info(
        `Switched to ${categoryName} - ${categoryProducts.length} product(s)`
      );
    }
  };

  const handleFilterClick = (filterType) => {
    setSelectedFilter(filterType);

    // Show informative toast for special filters
    if (filterType === "low-stock") {
      const lowStockCount = products.filter(
        (product) => product.stock < 10
      ).length;
      if (lowStockCount > 0) {
        info(`Found ${lowStockCount} product(s) with low stock (< 10 units)`);
      } else {
        info("No products with low stock found");
      }
    } else if (filterType === "top-selling") {
      const topSellingCount = products.filter(
        (product) => product.isTopSelling
      ).length;
      if (topSellingCount > 0) {
        info(`Showing ${topSellingCount} top-selling product(s)`);
      } else {
        info("No top-selling products found");
      }
    } else if (filterType === "available-products") {
      const availableCount = products.filter(
        (product) => product.stock > 0
      ).length;
      info(`Showing ${availableCount} available product(s) in stock`);
    } else if (filterType === "total-value") {
      info("Products sorted by highest inventory value");
    }
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
      case "available-products":
        return "Available Products";
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

        console.log("✅ Product deleted successfully");
        success("Product deleted successfully!");

        // Close modal with slight delay to ensure toast shows
        setTimeout(() => {
          closeModal();
        }, 100);
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

      // Determine the correct category ID
      let categoryId;
      if (formData.categoryId) {
        // User selected a new category from dropdown
        categoryId = parseInt(formData.categoryId);
      } else if (selectedProduct.categoryId) {
        // Use existing category ID
        categoryId = selectedProduct.categoryId;
      } else {
        // Fallback: find category ID by name
        const categoryFromName = categories.find(
          (cat) => cat.name === selectedProduct.category
        );
        categoryId = categoryFromName ? categoryFromName.id : 1; // Default to first category if not found
      }

      // Determine the correct supplier ID
      let supplierId;
      if (formData.supplierId) {
        // User selected a new supplier
        supplierId = parseInt(formData.supplierId);
      } else if (selectedProduct.supplierDetails?.id) {
        // Use existing supplier ID
        supplierId = selectedProduct.supplierDetails.id;
      } else {
        // Try to find supplier by name
        const supplierFromName = suppliers.find(
          (sup) => sup.name === selectedProduct.supplier
        );
        supplierId = supplierFromName ? supplierFromName.id : 1; // Default to first supplier if not found
      }

      // Construct supplier object for the nested supplier field
      const selectedSupplier = suppliers.find((s) => s.id === supplierId);
      const supplierData = selectedSupplier
        ? {
            name: selectedSupplier.name,
            contact_email: selectedSupplier.contact_email || null,
            contact_phone: selectedSupplier.contact_phone || null,
            address: selectedSupplier.address || null,
          }
        : {
            name: selectedProduct.supplier || "Unknown",
            contact_email: null,
            contact_phone: null,
            address: null,
          };

      // Prepare data for API - match the exact format expected
      const updateData = {
        name: productName,
        description: formData.description || selectedProduct.description || "",
        category: categoryId, // Must be a number (category ID)
        price: String(productPrice), // Must be a string
        quantity_in_stock: parseInt(productStock),
        sku: formData.sku || selectedProduct.sku || "",
        unit: selectedProduct.unit || "unit",
        expiry_date: formData.expiryDate || selectedProduct.expiryDate || null,
        supplier: supplierData, // Nested supplier object
        supplier_id: supplierId, // Required integer
      };

      console.log("🚀 Sending update to API:", updateData);
      console.log("🔍 Category ID:", categoryId, "Supplier ID:", supplierId);

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
                category:
                  typeof updateData.category === "number"
                    ? categories.find((c) => c.id === updateData.category)
                        ?.name || updateData.category
                    : updateData.category,
                categoryId:
                  typeof updateData.category === "number"
                    ? updateData.category
                    : getCategoryIdByName(updateData.category),
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

      console.log("✅ Product updated successfully");
      success("Product updated successfully!");

      // Close modal with slight delay to ensure toast shows
      setTimeout(() => {
        closeModal();
      }, 100);
    } catch (error) {
      console.error("❌ Error updating product:", error);
      showError(`Failed to update product: ${error.message}`);
    }
  };

  // Handle product save
  const handleProductSave = async (productData) => {
    try {
      console.log("💾 Saving new product:", productData);

      // Validate that supplier is provided since it's required by API
      if (!productData.supplier_id) {
        showError("Supplier is required");
        return;
      }

      // Find the selected supplier object for the nested supplier field
      const selectedSupplier = suppliers.find(
        (s) => s.id === parseInt(productData.supplier_id)
      );

      if (!selectedSupplier) {
        showError("Selected supplier not found");
        return;
      }

      // Find the selected category object
      const selectedCategory = categories.find(
        (c) => c.id === parseInt(productData.category)
      );

      if (!selectedCategory) {
        showError("Selected category not found");
        return;
      }

      // Map component data to EXACT API schema format
      const apiProductData = {
        name: productData.name, // required string
        description: productData.description || "", // optional string
        category: selectedCategory.id, // required category ID (integer)
        price: String(productData.buyingPrice), // required string (decimal)
        quantity_in_stock: parseInt(productData.quantity), // required integer
        sku: productData.sku || `SKU-${Date.now()}`, // optional string
        unit: productData.unit, // required string
        expiry_date: productData.expiryDate || null, // optional string (date)
        supplier: {
          name: selectedSupplier.name,
          contact_email: selectedSupplier.contact_email || null,
          contact_phone: selectedSupplier.contact_phone || null,
          address: selectedSupplier.address || null,
        },
        supplier_id: parseInt(productData.supplier_id), // required integer
      };

      console.log("🚀 Sending to API (exact schema match):", apiProductData);

      // Create product via API
      const response = await inventoryService.createProduct(apiProductData);

      console.log("✅ API Response:", response);

      // Map the new product to component format
      const newProduct = {
        id: response.product.id,
        name: response.product.name,
        category: response.product.category?.name || response.product.category,
        categoryId: getCategoryIdByName(
          response.product.category?.name || response.product.category
        ),
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

      console.log("✅ Product added successfully:", newProduct);
      success(`Product "${newProduct.name}" added successfully!`);

      // Close modal with slight delay to ensure toast shows
      setTimeout(() => {
        handleProductModalClose();
      }, 100);
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
    // Handle nested category object
    const actualCategoryName = categoryName?.name || categoryName;

    // Find in API categories
    const apiCategory = categories.find(
      (cat) => cat.name === actualCategoryName
    );
    if (apiCategory) {
      return apiCategory.id;
    }

    // If not found, return null or a default value
    console.warn(`Category not found in API: ${actualCategoryName}`);
    return null;
  };

  // Function to refresh categories after CRUD operations
  const refreshCategories = async () => {
    try {
      const result = await categoryService.getCategories();
      const apiCategories = result.categories || [];
      setCategories(apiCategories);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  };

  // Get categories with dynamic product counts from API data
  const getCategoriesWithCounts = () => {
    return categories.map((category) => {
      const categoryProducts = products.filter(
        (p) => p.category === category.name
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
          className="btn btn-sm border-0 bg-green-500 hover:bg-green-600 text-white"
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
          <button
            className="btn border-0 bg-blue-500 text-gray-100 hover:bg-blue-600 font-medium"
            onClick={() =>
              document.getElementById("category_management_modal").showModal()
            }
          >
            Manage Categories
          </button>
        </div>
      </div>

      {/* Category Management Modal */}
      <dialog id="category_management_modal" className="modal">
        <div className="modal-box bg-white max-w-4xl w-full text-black">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:text-gray-800">
              ✕
            </button>
          </form>
          <div className="text-black">
            <CategoryManagement onCategoryUpdate={refreshCategories} />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

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
            categories={categories}
            suppliers={suppliers}
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
                      <CategoryDropdown
                        value={
                          formData.categoryId || selectedProduct.categoryId
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            categoryId: e.target.value,
                          })
                        }
                        name="categoryId"
                        label=""
                        className="w-full"
                      />
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
                          ? (() => {
                              try {
                                const date = new Date(
                                  selectedProduct.dateAdded
                                );
                                return isNaN(date.getTime())
                                  ? "Invalid date"
                                  : date.toLocaleString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    });
                              } catch (error) {
                                return "Invalid date";
                              }
                            })()
                          : "Not set"}
                      </p>
                    ) : (
                      <input
                        type="datetime-local"
                        value={
                          formData.dateAdded ||
                          (selectedProduct.dateAdded
                            ? (() => {
                                try {
                                  const date = new Date(
                                    selectedProduct.dateAdded
                                  );
                                  return isNaN(date.getTime())
                                    ? ""
                                    : date.toISOString().slice(0, 16);
                                } catch (error) {
                                  return "";
                                }
                              })()
                            : "")
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateAdded: e.target.value,
                          })
                        }
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
                          ? (() => {
                              try {
                                const date = new Date(
                                  selectedProduct.expiryDate
                                );
                                return isNaN(date.getTime())
                                  ? "Invalid date"
                                  : date.toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    });
                              } catch (error) {
                                return "Invalid date";
                              }
                            })()
                          : "Not set"}
                      </p>
                    ) : (
                      <input
                        type="date"
                        value={
                          formData.expiryDate ||
                          (selectedProduct.expiryDate
                            ? (() => {
                                try {
                                  const date = new Date(
                                    selectedProduct.expiryDate
                                  );
                                  return isNaN(date.getTime())
                                    ? ""
                                    : date.toISOString().split("T")[0];
                                } catch (error) {
                                  return "";
                                }
                              })()
                            : "")
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
                      <select
                        value={
                          formData.supplierId ||
                          selectedProduct.supplierDetails?.id ||
                          ""
                        }
                        onChange={(e) => {
                          const selectedSupplierId = e.target.value;
                          const selectedSupplier = suppliers.find(
                            (s) => s.id.toString() === selectedSupplierId
                          );
                          setFormData({
                            ...formData,
                            supplierId: selectedSupplierId,
                            supplier: selectedSupplier?.name || "",
                            supplierDetails: selectedSupplier || null,
                          });
                        }}
                        className="w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select a supplier...</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
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
                          formData.supplierDetails?.address ||
                          selectedProduct.supplierDetails?.address ||
                          ""
                        }
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                        placeholder="Select a supplier to see address"
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
                          formData.supplierDetails?.contact_phone ||
                          selectedProduct.supplierDetails?.contact_phone ||
                          ""
                        }
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                        placeholder="Select a supplier to see contact"
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
                        className="btn border-0 bg-blue-500 hover:bg-blue-600 text-white flex-1"
                      >
                        Edit Product
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(selectedProduct.id)}
                        className="btn border-0 bg-red-500 hover:bg-red-600 text-white"
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
                        className="btn border-0 bg-green-500 hover:bg-green-600 text-white flex-1"
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <FilterCard
            title="Total Products"
            value={currentCategoryData.totalProducts}
            subtitle="All items"
            filterType="total-products"
            icon="📦"
          />

          <FilterCard
            title="Available"
            value={
              selectedCategory === "all"
                ? products.filter((p) => p.stock > 0).length
                : products.filter(
                    (p) => p.category === selectedCategory && p.stock > 0
                  ).length
            }
            subtitle="In stock"
            filterType="available-products"
            icon="✅"
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
