import React from "react";

const CheckoutCard = ({ items, onClose }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[400px] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-500">🛒 Checkout</h2>
        {items.length === 0 ? (
          <p className="text-gray-700">Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-gray-700">
                <span>{item.name}</span>
                <span>GHS {item.price}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 border-t pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span>GHS {total}</span>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutCard;
