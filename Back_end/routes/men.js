
const express = require('express');
const router = express.Router();
const Perfume = require('../models/Perfumes');

/**
 * men's perfumes statistics endpoint
 */
router.get("/", async (req, res) => {
  console.log("Received request to /api/men");

  try {
    const perfumes = await Perfume.find({ gender: "men" });
    console.log(" Successfully fetched men's perfumes", perfumes.length);

    // Same analytics structure as general endpoint but filtered for men
    const brands = new Set(perfumes.map(p => p.brand)).size;
    const ordersCount = perfumes.reduce((total, p) => total + p.sold, 0);
    const usersCount = perfumes.filter(p => p.sold > 0).length;
    const revenue = Math.trunc(perfumes.reduce((total, p) => total + (p.sold * p.price), 0));

    // Chart data (same as general but for men only)
    const stockVsSales = perfumes.map(p => ({
      stock: p.available,
      sales: p.sold
    }));

    const salesByPriceRange = {};
    perfumes.forEach(p => {
      const range = `${Math.floor(p.price / 10) * 10}-${Math.floor(p.price / 10) * 10 + 9}`;
      salesByPriceRange[range] = (salesByPriceRange[range] || 0) + p.sold;
    });
    const salesByPriceRangeArray = Object.entries(salesByPriceRange).map(([range, sales]) => ({ range, sales }));
    
    const priceVsSales = perfumes.map(p => ({ price: p.price, sales: p.sold }));
    
    const brandSales = {};
    perfumes.forEach(p => {
      brandSales[p.brand] = (brandSales[p.brand] || 0) + p.sold;
    });
    const brandSalesArray = Object.entries(brandSales).map(([brand, sales]) => ({ brand, sales }));

    const top10Perfumes = perfumes
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
      .map(p => ({ name: p.title, sales: p.sold }));

    const salesByType = {};
    perfumes.forEach(p => {
      salesByType[p.type] = (salesByType[p.type] || 0) + p.sold;
    });
    const salesByTypeArray = Object.entries(salesByType).map(([type, sales]) => ({ type, sales }));

    res.json({
      users: usersCount,
      orders: ordersCount,
      products: brands,
      revenue,
      priceVsSales,
      stockVsSales,
      salesByPriceRange: salesByPriceRangeArray,
      brandSales: brandSalesArray,
      top10Perfumes,
      salesByType: salesByTypeArray
    });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
  });


  module.exports = router;