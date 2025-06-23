import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { inventoryService } from "../../services/inventoryService";
import HybridFeedImage from "../../assets/hybridfeed.png";
import HalfDozenEggsImage from "../../assets/eggcrate.png";
import DayOldChicksImage from "../../assets/dayoldchicks.png";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data - replace with API call
  const mockProducts = [
    { id: 1, name: "Hybrid Feed", stock: 10, img: HybridFeedImage, price: 150 },
    {
      id: 2,
      name: "Half Dozen Eggs",
      stock: 7,
      img: HalfDozenEggsImage,
      price: 30,
    },
    {
      id: 3,
      name: "Day Old Chicks",
      stock: 8,
      img: DayOldChicksImage,
      price: 5,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with actual API call
        // const response = await inventoryService.getProducts();
        // setProducts(response.data);

        // Using mock data for now
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <p className="text-green-600 text-sm mb-2">{product.stock} In-stock</p>
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

  return (
    <AdminLayout title="Inventory Management">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Total Products ({products.length})
          </h2>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button className="btn btn-primary">Add Product</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No products found. Add your first product to get started.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Inventory;
