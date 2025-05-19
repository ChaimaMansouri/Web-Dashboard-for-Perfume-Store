import React, { useState } from "react";

const ItemsList = ({data,type}) => {
  const [showMore, setShowMore] = useState(false);
  console.log("end",data)

  const items = data;

  return (
    
    <div className="w-full">
      <h2 className="text-[16px] font-bold text-gray-550 mb-2">ALL BRANDS</h2>
      <div className={`overflow-hidden ${showMore ? "max-h-60 overflow-y-auto" : "max-h-41"}`}>
        {items.slice(0, showMore ? items.length : 6).map((item, index) => (
          <div key={index} className={`flex justify-between py-2 ${index % 2 === 0 ? "line" : "line2"}`}>
            <h3>{item.brand}</h3>
            <h3>{item.sales} sales</h3>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowMore(!showMore)}
        className="w-full text-center mt-5 border border-gray-500 rounded-4xl py-2 dark:text-gray-300 text-gray-700"
      >
        {showMore ? "View Less" : "View All"}
      </button>
    </div>
  );
};

export default ItemsList;
