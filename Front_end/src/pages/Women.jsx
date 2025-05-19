import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import Charts from "../components/Charts";
const baseURL = import.meta.env.VITE_BACKEND_URL;

const Women = () => {
  //Back end 


  // State management for API data and errors
const [data, setData] = useState(null);  // Stores the fetched data
const [error, setError] = useState(null); // Stores any error messages

/**
 * useEffect hook for fetching women's perfume data from backend API
 * Runs only once when component mounts (empty dependency array [])
 */
useEffect(() => {
  /**
   * Async function to fetch data from API endpoint
   */
  const fetchData = async () => {
    try {
      // 1. Make GET request to women's perfume API endpoint
      const response = await fetch(`${baseURL}/api/women`);
      
      // 2. Check if response was successful (status 200-299)
      if (!response.ok) throw new Error("❌ Failed to fetch data from API");

      // 3. Parse JSON response if successful
      const fetchedData = await response.json();
      console.log("✅ Successfully fetched data:", fetchedData);

      // 4. Update state with the fetched data
      setData(fetchedData);
      
    } catch (error) {
      // Handle any errors that occur during fetching
      console.error("❌ Data fetching error:", error);
      
      // 5. Set error state to display user-friendly message
      setError("An error occurred while loading data. Please try again later.");
    }
  };

  // Execute the data fetching function
  fetchData();

  // Empty dependency array ensures this runs only on component mount
}, []); 


  //Back end

  
  return (
    <div className="flex max-[700px]:flex-col min-h-screen bg-gray-100 dark:bg-[#272727]">
      <div className="z-10 max-[700px]:rounded-xl">
        <Sidebar />
      </div>
      <div className="flex-1 p-8 w-[70%] max-[700px]:w-full ml-[20%] max-[700px]:ml-0 max-[800px]:pb-[100px] pb-50">
        {data ? (
          <>
            <Cards
              data={[
                { icon: "groups", title: "Users", value: data.users ?? 0 },
                { icon: "shopping_cart", title: "Orders", value: data.orders ?? 0 },
                { icon: "inventory", title: "Brands", value: data.products ?? 0 },
                { icon: "attach_money", title: "Revenue", value: data.revenue ?? 0 }
              ]}
              type="women"
            />
            <Charts
              data={[
                { title: "Sales by Price Range", data: data.salesByPriceRange },
                { title: "Brand Sales", data: data.brandSales },
                { title: "Price vs Sales", data: data.priceVsSales },
                { title: "Availability vs Sales", data: data.stockVsSales },
                { title: "Best Perfumes vs Sales", data: data.top10Perfumes },
                { title: "Type vs Sales", data: data.salesByType },
              ]}
              type="women"
            />
          </>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-500"></p>
        )}
      </div>
    </div>
  );
};

export default Women;
