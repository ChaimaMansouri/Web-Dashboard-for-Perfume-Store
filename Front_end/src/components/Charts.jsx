import React, { useEffect, useRef } from "react";
import "../styles/style.css";
import ItemsList from "../components/ItemsList"; 



import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ScatterController,
  PointElement,
  Title,
} from "chart.js";

// Register the required Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ScatterController,
  PointElement,
  Title
);

const Charts = ({ data, type }) => {
  console.log("Received data:", data);

  // Sort data descendingly and take top 10 brands
  const topBrands = data[1]?.data
    ?.sort((a, b) => b.sales - a.sales) // Sort by sales (descending)
    ?.slice(0, 10); // Take only top 10 brands

  // Extract brand names and sales from filtered data
  const brandLabels = topBrands?.map(item => item.brand) || [];
  const brandData = topBrands?.map(item => item.sales) || [];

  const salesLabels = data[0].data.map(item => item.sales);
  const rangeData = data[0].data.map(item => item.range);

  // Prepare scatter plot data (price vs sales)
  const scatterData = data[2]?.data?.map(item => ({
    x: item.price,  // X-axis represents price
    y: item.sales   // Y-axis represents sales
  })) || [];

  // Prepare scatter plot data (stock vs sales)
  const scatterStockData = data[3]?.data?.map(item => ({
    x: item.stock,  // X-axis represents stock availability
    y: item.sales   // Y-axis represents sales
  })) || [];
  
  // Extract data for top perfumes chart
  const perfumeNames = data[4].data.map(item => item.name);
  const perfumeSales = data[4].data.map(item => item.sales);

  // Calculate average sales by perfume type
  const typeAverages = data[5].data.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = { totalSales: 0, count: 0 };
    }
    acc[item.type].totalSales += item.sales;
    acc[item.type].count += 1;
    return acc;
  }, {});
  
  // Extract type labels and calculate average sales
  const typeLabels = Object.keys(typeAverages); 
  const typeSalesData = Object.values(typeAverages).map(values => values.totalSales / values.count);

  // Chart references
  const barRef = useRef(null);
  const barTrendRef = useRef(null);
  const brandRef = useRef(null);
  const perfumeRef = useRef(null);
  const scatterRef1 = useRef(null);
  const scatterRef2 = useRef(null);

  useEffect(() => {
    if (!barRef.current || !barTrendRef.current || !scatterRef1.current || 
        !scatterRef2.current || !brandRef.current || !perfumeRef.current) return;
  
    const isDarkMode = document.documentElement.classList.contains("dark");
  
    // Toggle prism-card class based on dark mode
    document.querySelectorAll(".removeprism").forEach((el) => {
      if (isDarkMode) {
        el.classList.remove("prism-card");
      } else {
        el.classList.add("prism-card");
      }
    });
  
    // Get canvas contexts
    const ctxs = {
      bar: barRef.current.getContext("2d"),
      barTrend: barTrendRef.current.getContext("2d"),
      scatter1: scatterRef1.current.getContext("2d"),
      scatter2: scatterRef2.current.getContext("2d"),
      brand: brandRef.current.getContext("2d"),
      perfume: perfumeRef.current.getContext("2d"),
    };
  
    // Clean up previous charts
    Object.values(ctxs).forEach((ctx) => Chart.getChart(ctx.canvas)?.destroy());
   
    // Helper function to generate chart titles
    const getTitle = () => {
      switch (type) {
        case "men":
          return "Men's ";
        case "women":
          return "Women's ";
        case "general":
          return "General ";
        default:
          return "Data ";
      }
    };

    // Chart configurations
    const chartConfigs = [
      {
        ctx: ctxs.bar,
        type: "bar",
        title: `Top ${getTitle()}Perfume Brands by Sales`,
        xTitle: "Brands",
        yTitle: "Sales",
        labels: brandLabels,
        data: brandData,
      },
      {
        ctx: ctxs.barTrend,
        type: "bar",
        title: `${getTitle()}Perfume Sales by Price Range`,
        xTitle: "Price Range ($)",
        yTitle: "Sales",
        labels: rangeData,
        data: salesLabels,
      },
      {
        ctx: ctxs.brand,
        type: "bar",
        title: `Top 10 Best-Selling ${getTitle()}Perfumes`,
        xTitle: "Sales",
        yTitle: "Perfumes",
        labels: perfumeNames,
        data: perfumeSales,
        options: { indexAxis: "y" }, // Horizontal bar chart
      },
      {
        ctx: ctxs.perfume,
        type: "bar",
        title: `${getTitle()}Perfumes: Sales by Type`,
        xTitle: "Type",
        yTitle: "Sales",
        labels: typeLabels,
        data: typeSalesData,
      },
      {
        ctx: ctxs.scatter1,
        type: "scatter",
        title: `${getTitle()}Perfumes: Price vs Sales`,
        xTitle: "Price ($)",
        yTitle: "Sales",
        data: scatterData,
      },
      {
        ctx: ctxs.scatter2,
        type: "scatter",
        title: `${getTitle()}Perfumes: Availability vs Sales`,
        xTitle: "Availability (Stock)",
        yTitle: "Sales",
        data: scatterStockData,
      },
    ];
  
    // Initialize all charts
    chartConfigs.forEach(({ ctx, type, title, xTitle, yTitle, labels, data, options = {} }) => {
      new Chart(ctx, {
        type,
        data: {
          labels: type === "scatter" ? undefined : labels,
          datasets: [
            {
              label: "Sales",
              data: data,
              backgroundColor: type === "scatter" ? "#a855f7" : "#7e22ce",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { title: { display: true, text: xTitle } },
            y: { title: { display: true, text: yTitle } },
          },
          plugins: {
            legend: { display: true },
            title: { 
              display: true, 
              text: title, 
              font: { size: 15 }, 
              padding: { bottom: 20 } 
            },
          },
          ...options,
        },
      });
    });
  }, [data, type]);
  

  return (
    <div className="max-[800px]:ml-5">
      {/* First row of charts */}
      <div className="flex max-[800px]:flex-col">
        <div className="removeprism prism-card chart-container rounded-lg dark:bg-[#1e1e1e]">
          <canvas ref={scatterRef1} className="p-5 chart"></canvas>
        </div>
        <div className="removeprism prism-card chart-container rounded-lg dark:bg-[#1e1e1e]">
          <canvas ref={barTrendRef} className="p-5 pb-0 chart"></canvas>
        </div>
        <div className="removeprism prism-card chart-container rounded-lg dark:bg-[#1e1e1e]">
          <canvas ref={barRef} className="p-5 pb-0 chart"></canvas>
        </div>
      </div>

      {/* Second row of charts */}
      <div className="flex max-[800px]:flex-col">
        <div className="removeprism prism-card ch rounded-lg max-[800px]:w-[95%] max-[800px]:ml-0 dark:bg-[#1e1e1e]">
          <canvas ref={perfumeRef} className="p-5 chart"></canvas>
        </div>

        {/* Brands list section */}
        <div className="removeprism prism-card option w-[30%] p-5 mt-5 dark:bg-[#1e1e1e] dark:text-gray-300 bg-white max-[800px]:w-[95%] rounded-lg flex flex-col justify-between">
          <div>
            <ItemsList data={data[1].data} type={type}/>
          </div>
        </div>
      </div>

      {/* Third row of charts */}
      <div className="flex justify-between max-[800px]:flex-col">
        <div className="removeprism prism-card charts rounded-lg dark:bg-[#1e1e1e]">
          <canvas ref={brandRef} className="p-5 chart"></canvas>
        </div>
        <div className="removeprism prism-card charts rounded-lg dark:bg-[#1e1e1e]">
          <canvas ref={scatterRef2} className="p-5 chart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Charts;
