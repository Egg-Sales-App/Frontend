// Empty State Messages and Fallback Constants
export const EMPTY_STATE_MESSAGES = {
  SALES_OVERVIEW: {
    title: "No Sales Data Available",
    message: "Sales data will appear here once you start recording transactions.",
    icon: "📊"
  },
  
  TOP_SELLING_PRODUCTS: {
    title: "No Sales Data Available", 
    message: "Best selling products will appear here once you start recording sales.",
    icon: "📦"
  },
  
  LOW_STOCK_ITEMS: {
    title: "No Low Stock Items",
    message: "All products are well stocked. Low stock alerts will appear here when inventory runs low.",
    icon: "✅"
  },
  
  INVENTORY: {
    title: "No Products Available",
    message: "Start by adding products to your inventory.",
    icon: "📦"
  },
  
  ORDERS: {
    title: "No Orders Found",
    message: "Customer orders will appear here once they start placing orders.",
    icon: "🛒"
  },
  
  SUPPLIERS: {
    title: "No Suppliers Found", 
    message: "Add suppliers to manage your product sourcing.",
    icon: "🏪"
  },
  
  EMPLOYEES: {
    title: "No Employees Found",
    message: "Add team members to manage store operations.",
    icon: "👥"
  },
  
  REPORTS: {
    title: "No Report Data",
    message: "Reports will generate once you have sales and inventory data.",
    icon: "📈"
  }
};

// Default fallback values
export const DEFAULT_VALUES = {
  CURRENCY: "GHS",
  PAGINATION_SIZE: 10,
  DEFAULT_AVATAR: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  DEFAULT_PRODUCT_IMAGE: "/assets/equipment.png"
};

// Status definitions
export const STATUS_TYPES = {
  ACTIVE: "active",
  INACTIVE: "inactive", 
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock"
};

// Category color mappings for consistency
export const CATEGORY_COLORS = {
  "Feeds": "bg-green-100 text-green-800",
  "Equipment": "bg-blue-100 text-blue-800", 
  "Chicks": "bg-orange-100 text-orange-800",
  "Medicine": "bg-red-100 text-red-800",
  "Eggs": "bg-yellow-100 text-yellow-800",
  "General": "bg-gray-100 text-gray-800"
};
