import { useNavigate } from "react-router-dom";
import { Store, Package, Egg, ArrowRight, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import equipmentStoreImg from "../assets/equipmentstore.png";
import feedStoreImg from "../assets/feedstore.png";

const StoreSelector = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelect = (store) => {
    navigate(`/pos/${store}/dashboard`);
  };

  const stores = [
    {
      id: "equipment",
      name: "Equipment Store",
      description: "Poultry equipment, feeders, broilers, and farming tools",
      image: equipmentStoreImg,
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      icon: Package,
      features: ["Broiler Equipment", "Feeders & Waterers", "Farm Tools"],
    },
    {
      id: "feeds",
      name: "Feeds & Eggs Store",
      description:
        "Premium chicken feeds, fresh eggs, and nutritional supplements",
      image: feedStoreImg,
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      icon: Egg,
      features: ["Premium Feeds", "Fresh Eggs", "Supplements"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.username || user?.email || "User"}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your store to begin managing inventory, sales, and customer
            transactions
          </p>
        </div>

        {/* Store Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stores.map((store) => (
            <div
              key={store.id}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
              onClick={() => handleSelect(store.id)}
            >
              {/* Store Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${store.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                ></div>
                <div className="absolute top-4 right-4">
                  <div
                    className={`bg-gradient-to-r ${store.color} text-white p-2 rounded-full shadow-lg`}
                  >
                    <store.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Store Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {store.name}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {store.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {store.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <div
                        className={`w-2 h-2 bg-gradient-to-r ${store.color} rounded-full mr-3`}
                      ></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(store.id);
                  }}
                  className={`w-full bg-gradient-to-r ${store.color} hover:${store.hoverColor} text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-lg`}
                >
                  <Store className="h-5 w-5" />
                  <span>Enter {store.name}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600">
              Contact support if you need assistance with store selection or
              have questions about our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSelector;
