const express = require('express');
const router = express.Router();
const Perfume = require('../models/Perfumes');
const MLR = require('ml-regression').SimpleLinearRegression;

router.get("/", async (req, res) => {
  console.log("Received request to /api/predictions");

  try {
    const { gender, brand, type } = req.query;
    let query = {};
    
    if (gender) query.gender = gender;
    if (brand) query.brand = brand;
    if (type) query.type = type;

    const perfumes = await Perfume.find(query).sort({ lastUpdated: 1 });
    console.log(" Successfully fetched perfumes", perfumes.length);

    // Extract unique values
    const brands = [...new Set(perfumes.map(p => p.brand))];
    const types = [...new Set(perfumes.map(p => p.type))];
    const genders = [...new Set(perfumes.map(p => p.gender))];
    const names = [...new Set(perfumes.map(p => p.title))];

    // Calculate statistics
    const totalRevenue = perfumes.reduce((sum, p) => sum + (p.price * p.sold), 0);
    const avgPrice = perfumes.length > 0 
      ? perfumes.reduce((sum, p) => sum + p.price, 0) / perfumes.length 
      : 0;
    
    // Find top selling location
    const locationStats = {};
    perfumes.forEach(p => {
      locationStats[p.itemLocation] = (locationStats[p.itemLocation] || 0) + p.sold;
    });
    const topLocation = Object.entries(locationStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate total available stock
    const totalStock = perfumes.reduce((sum, p) => sum + (p.available || 0), 0);

    // Find last update
    const lastUpdate = perfumes.length > 0 
      ? new Date(Math.max(...perfumes.map(p => new Date(p.lastUpdated)))) 
      : null;

    // Generate sales trend data
    const salesTrend = generateSalesTrend(perfumes);

    res.json({
      brands, 
      types, 
      genders, 
      names,
      stats: {
        predictedRevenue: totalRevenue * 1.12, // Adding 12% prediction
        averagePrice: avgPrice,
        confidenceScore: calculateConfidenceScore(perfumes),
        topSellingLocation: topLocation,
        availableStock: totalStock,
        lastUpdated: lastUpdate
      },
      salesTrend
    });

  } catch (error) {
    console.error(" Error fetching data:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function to generate sales trend data
function generateSalesTrend(perfumes) {
  if (perfumes.length === 0) return [];

  // Group by month and calculate total sales
  const monthlySales = {};
  perfumes.forEach(p => {
    const date = new Date(p.lastUpdated);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlySales[monthYear]) {
      monthlySales[monthYear] = {
        sales: 0,
        count: 0
      };
    }
    monthlySales[monthYear].sales += p.sold;
    monthlySales[monthYear].count++;
  });

  // Convert to array and sort by date
  const sortedMonths = Object.keys(monthlySales).sort();
  const result = [];
  
  // Prepare data for regression
  const x = [];
  const y = [];
  
  sortedMonths.forEach((month, index) => {
    const avgSales = monthlySales[month].sales / monthlySales[month].count;
    result.push({
      name: month,
      sales: avgSales
    });
    
    x.push(index);
    y.push(avgSales);
  });

  // If we have enough data points, make predictions
  if (x.length >= 3) {
    const regression = new MLR(x, y);
    
    // Add predictions to the result
    result.forEach((monthData, index) => {
      monthData.prediction = regression.predict(index);
    });

    // Predict next month
    const nextMonthIndex = x.length;
    const nextMonthPrediction = regression.predict(nextMonthIndex);
    const nextMonthName = getNextMonthName(sortedMonths[sortedMonths.length - 1]);
    
    result.push({
      name: nextMonthName,
      prediction: nextMonthPrediction,
      isPrediction: true
    });
  }

  return result;
}

function getNextMonthName(lastMonth) {
  const [year, month] = lastMonth.split('-').map(Number);
  const nextDate = new Date(year, month - 1, 1);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1).toString().padStart(2, '0')}`;
}

function calculateConfidenceScore(perfumes) {
  if (perfumes.length === 0) return 0;
  
  // Simple confidence calculation based on data points
  const dataPoints = perfumes.length;
  const minDataPoints = 10;
  
  return Math.min(100, Math.floor((dataPoints / minDataPoints) * 100));
}

module.exports = router;