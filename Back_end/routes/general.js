
const express = require('express');
const router = express.Router();
const Perfume = require('../models/Perfumes');

/**
 * General perfumes statistics endpoint
 */
router.get("/", async (req, res) => {
  console.log(" Received request to /api/general");

  try {
    const perfumes = await Perfume.find(); // Fetch all perfumes
    console.log("Successfully fetched perfumes", perfumes.length);

    //  General statistics
    const brands = new Set(perfumes.map(p => p.brand)).size; // Count unique brands
    const ordersCount = perfumes.reduce((total, p) => total + p.sold, 0); // Total units sold
    const usersCount = perfumes.filter(p => p.sold > 0).length; // Count perfumes with sales
    const revenue = Math.trunc(perfumes.reduce((total, p) => total + (p.sold * p.price), 0)); // Total revenue

    //  Chart data

    // 1️ Scatter Plot: Availability vs Sales
    const stockVsSales = perfumes.map(p => ({
      stock: p.available, // Available or not
      sales: p.sold
    }));

    // 2️ Sales by price range
    const salesByPriceRange = {};
    perfumes.forEach(p => {
      const range = `${Math.floor(p.price / 10) * 10}-${Math.floor(p.price / 10) * 10 + 9}`;
      salesByPriceRange[range] = (salesByPriceRange[range] || 0) + p.sold;
    });
    const salesByPriceRangeArray = Object.entries(salesByPriceRange).map(([range, sales]) => ({ range, sales }));
    
    // Price vs Sales data
    const priceVsSales = perfumes.map(p => ({ price: p.price, sales: p.sold }));
    
    // 3️ Brand sales data
    const brandSales = {};
    perfumes.forEach(p => {
      brandSales[p.brand] = (brandSales[p.brand] || 0) + p.sold;
    });
    const brandSalesArray = Object.entries(brandSales).map(([brand, sales]) => ({ brand, sales }));

    // 4️ Top 10 best-selling perfumes (Horizontal Bar Chart)
    const top10Perfumes = perfumes
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
      .map(p => ({ name: p.title, sales: p.sold }));

    // 5️ Sales by perfume type (Vertical Bar Chart)
    const salesByType = {};
    perfumes.forEach(p => {
      salesByType[p.type] = (salesByType[p.type] || 0) + p.sold;
    });
    const salesByTypeArray = Object.entries(salesByType).map(([type, sales]) => ({ type, sales }));

    // 6️ Sales distribution by gender (Pie Chart)
    const salesByGender = { men: 0, women: 0 };
    perfumes.forEach(p => {
      if (salesByGender[p.gender] !== undefined) {
        salesByGender[p.gender] += p.sold;
      }
    });

    // 7️ Top 5 most listed perfumes (Bar Chart)
    const top5ListedPerfumes = perfumes
      .sort((a, b) => b.available - a.available)
      .slice(0, 5)
      .map(p => ({ name: p.title, stock: p.available }));
    
    // 8️Location and sold for each location 
    const locationSales = perfumes.reduce((acc, p) => {
      const country = p.itemLocation.split(", ").pop(); // Country
      acc[country] = (acc[country] || 0) + p.sold; //Sold
      return acc;
    }, {});
    
    const locationSalesArray = Object.entries(locationSales).map(([location, sales]) => ({ location, sales }));
    
    

    res.json({
      users: usersCount,
      orders: ordersCount,
      products: brands,
      revenue,
      priceVsSales,
      stockVsSales,  // Scatter Plot: Stock vs Sales
      salesByPriceRange: salesByPriceRangeArray,
      brandSales: brandSalesArray,
      top10Perfumes,  // Top 10 best-selling perfumes
      salesByType: salesByTypeArray,  // Sales by perfume type
      salesByGender,  // Sales distribution by gender
      top5ListedPerfumes, // Top 5 most listed perfumes
      locationSalesArray
    });
    console.log("Data sent successfully");

  } catch (error) {
    console.error(" Error fetching data:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
  });


  module.exports = router;