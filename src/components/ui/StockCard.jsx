import React from "react";

const StockCard = ({ name, image, remainingQuantity, status = "Low" }) => (
  <section className="w-full h-[75px] bg-white shadow rounded-lg flex items-center gap-3 p-2">
    <div className="w-[60px] h-[70px] rounded-md overflow-hidden flex-shrink-0">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col justify-center flex-grow">
      <span className="text-[16px] font-semibold text-gray-800">{name}</span>
      <span className="text-[14px] text-gray-500">
        Remaining Quantity : {remainingQuantity}
      </span>
    </div>
    <div className="flex-shrink-0">
      <div className="bg-[#FEECEB] text-[#AA3028] text-xs font-medium px-2 py-1 rounded-full">
        {status}
      </div>
    </div>
  </section>
);

export default StockCard;
