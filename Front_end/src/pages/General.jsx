import React, {useRef, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Cards from "../components/Cards";
import Charts from "../components/Charts";
import Plotly from "plotly.js-dist";
import "../styles/style.css";
import { Chart } from "chart.js/auto";
const baseURL = import.meta.env.VITE_BACKEND_URL;
import Chartgeneral from "../components/Chartgeneral";




const General= () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const chartRefs = useRef({ pie: null, bar: null, map: null });
  const chartsRef = useRef([]);

  useEffect(() => {
    /**
     * Fetches general data from the API when component mounts
     */
    const fetchData = async () => {
      try {
        // Make GET request to the API endpoint
        const response = await fetch(`${baseURL}/api/general`);
        
        // Throw error if response is not successful (status code outside 200-299)
        if (!response.ok) throw new Error("❌ Failed to fetch data");
  
        // Parse JSON response
        const fetchedData = await response.json();
        console.log("✅ Retrieved data:", fetchedData);
  
        // Store all data in a single state variable
        setData(fetchedData);
        
      } catch (error) {
        console.error("❌ Data fetching error:", error);
        // Set error message for user feedback
        setError("An error occurred while loading data. Please try again later.");
      }
    };
  
    // Execute the fetch function
    fetchData();
    
    // Empty dependency array means this runs only once on component mount
  }, []);

  
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
              type="general"
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
              type="general"
            />
              <Chartgeneral data={[
                { title: "top5ListedPerfumes", data: data.top5ListedPerfumes },
                { title: "Sales By Gender", data: data.salesByGender },
                { title: "Location", data: data.locationSalesArray },
              
              ]}
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

export default General;