import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import HybridFeedImage from '../../assets/hybridfeed.png';
import HalfDozenEggsImage from '../../assets/eggcrate.png';
import DayOldChicksImage from '../../assets/dayoldchicks.png';

const Inventory = () => {
  const products = [
    { name: 'Hybrid Feed', stock: 10, img: HybridFeedImage },
    { name: 'Half Dozen Eggs', stock: 7, img: HalfDozenEggsImage },
    { name: 'Day Old Chicks', stock: 8, img: DayOldChicksImage },
  ];

  const ProductCard = ({ name, stock, img }) => (
    <div className="w-48 h-72 bg-white rounded-xl shadow p-4 flex flex-col items-center justify-between">
      <img
        src={img}
        alt={name}
        className="w-32 h-32 object-cover rounded-full"
      />
      <div className="text-center">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-green-600 text-sm">{stock} In-stock</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen pt-[64px]">
      <Sidebar />
      <div className="ml-[200px] flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-100 p-8">
          <h1 className="text-xl font-bold mb-6">Total Products</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                stock={product.stock}
                img={product.img}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
