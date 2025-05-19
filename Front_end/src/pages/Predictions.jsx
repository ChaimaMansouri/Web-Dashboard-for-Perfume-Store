import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
const baseURL = import.meta.env.VITE_BACKEND_URL;

const Predictions = () => {
  const [selectedPerfume, setSelectedPerfume] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState({
    brands: [],
    types: [],
    names: []
  });
  const [stats, setStats] = useState({
    predictedRevenue: 0,
    averagePrice: 0,
    confidenceScore: 0,
    topSellingLocation: '',
    availableStock: 0,
    lastUpdated: null
  });
  const [chartData, setChartData] = useState([]);

  // Fetch initial data
  useEffect(() => {
    // Replace your fetchInitialData function with this:
  const fetchInitialData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(`${baseURL}/api/predictions`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const fetchedData = await response.json();
    
    if (!fetchedData) {
      throw new Error("Received empty data from server");
    }

    setData(fetchedData);
    setFilteredData({
      brands: fetchedData.brands || [],
      types: fetchedData.types || [],
      names: fetchedData.names || []
    });
    
    if (fetchedData.stats) {
      setStats(fetchedData.stats);
    }
    
    if (fetchedData.salesTrend) {
      setChartData(fetchedData.salesTrend);
    }
  } catch (error) {
    console.error("Data fetching error:", error);
    setError(error.message || "An error occurred while loading data. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};

    fetchInitialData();
  }, []);

  // Handle filter changes
  const handleFilterChange = async (url) => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch filtered data");
      const result = await response.json();
      
      if (result.salesTrend) {
        setChartData(result.salesTrend);
      }
      return result;
    } catch (error) {
      console.error("Filter error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle gender change
  const handleGenderChange = async (e) => {
    const gender = e.target.value;
    setSelectedGender(gender);
    setSelectedBrand('');
    setSelectedType('');
    setSelectedPerfume('');

    try {
      const url = gender 
        ?  `${baseURL}/api/predictions?gender=${gender}`
        : `${baseURL}/api/predictions`;
      
      const result = await handleFilterChange(url);
      
      setFilteredData({
        brands: result.brands || [],
        types: [],
        names: []
      });
      
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  // Handle brand change
  const handleBrandChange = async (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedType('');
    setSelectedPerfume('');

    try {
      const params = new URLSearchParams();
      if (selectedGender) params.append('gender', selectedGender);
      if (brand) params.append('brand', brand);
      
      const result = await handleFilterChange(`${baseURL}/api/predictions?${params.toString()}` );
      
      setFilteredData(prev => ({
        ...prev,
        types: result.types || [],
        names: []
      }));
      
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  // Handle type change
  const handleTypeChange = async (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setSelectedPerfume('');

    try {
      const params = new URLSearchParams();
      if (selectedGender) params.append('gender', selectedGender);
      if (selectedBrand) params.append('brand', selectedBrand);
      if (type) params.append('type', type);
      
      const result = await handleFilterChange(`${baseURL}/api/predictions?${params.toString()}`);
      
      setFilteredData(prev => ({
        ...prev,
        names: result.names || []
      }));
      
      if (result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  // Handle perfume change
  const handlePerfumeChange = (e) => {
    setSelectedPerfume(e.target.value);
  };

  // Dark mode handling
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    document.querySelectorAll(".removeprism").forEach((el) => {
      el.classList.toggle("prism-card", !isDarkMode);
    });
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Format month-year for display
  const formatMonth = (monthYear) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex max-[700px]:flex-col min-h-screen bg-gray-100 dark:bg-[#272727] ">
      <Sidebar className="z-10 max-[700px]:rounded-xl"/>
      <div className="flex-1 p-8 w-[70%] max-[700px]:w-full ml-[20%] max-[700px]:ml-0 max-[800px]:pb-[100px] pb-50">
        <div className="relative z-10 bg-white/100 backdrop-blur-lg p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
          <h1 className="text-3xl font-bold text-black mb-2 dark:text-gray-300">Sales Predictions</h1>
          <p className="text-black-100">Analyze and predict perfume sales trends</p>
        </div>

        {/* Filters Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gender Filter */}
          <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Gender</label>
            <select 
              value={selectedGender}
              onChange={handleGenderChange}
              className="w-full p-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 dark:bg-[#1e1e1e]"
              disabled={isLoading}
            >
              <option value="">All Genders</option>
              {data?.genders?.map((gender) => (
                <option key={gender} value={gender}>
                  {gender === 'women' ? "Women's" : gender === 'men' ? "Men's" : gender}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Brand</label>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="w-full p-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 dark:bg-[#1e1e1e]"
              disabled={!selectedGender || isLoading}
            >
              <option value="">All Brands</option>
              {filteredData.brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Type</label>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full p-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 dark:bg-[#1e1e1e]"
              disabled={!selectedBrand || isLoading}
            >
              <option value="">All Types</option>
              {filteredData.types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Perfume Filter */}
          <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Perfume Name</label>
            <select
              value={selectedPerfume}
              onChange={handlePerfumeChange}
              className="w-full p-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 dark:bg-[#1e1e1e]"
              disabled={!selectedType || isLoading}
            >
              <option value="">All Perfumes</option>
              {filteredData.names.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="removeprism prism-card p-6 rounded-xl col-span-2 dark:bg-[#1e1e1e] dark:text-gray-300">
            <h2 className="text-xl font-semibold mb-4 text-purple-800">Sales Prediction Trend</h2>
            <div className="h-[400px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tickFormatter={formatMonth}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, value === 'sales' ? 'Actual Sales' : 'Predicted Sales']}
                      labelFormatter={formatMonth}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#8884d8" 
                      name="Actual Sales"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="prediction" 
                      stroke="#82ca9d" 
                      name="Predicted Sales"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No sales data available for the selected filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Predicted Revenue</h3>
              <p className="text-3xl font-bold gradient-text">
                ${stats.predictedRevenue.toLocaleString('en-US', {maximumFractionDigits: 0})}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                {stats.predictedRevenue > 0 ? `+12% from last period` : 'No data available'}
              </p>
            </div>
            
            <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Average Price</h3>
              <p className="text-3xl font-bold gradient-text">
                ${stats.averagePrice.toFixed(2)}
              </p>
              <p className="text-sm text-purple-600 mt-1">Based on current selection</p>
            </div>
            
            <div className="removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e] dark:text-gray-300">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Confidence Score</h3>
              <p className="text-3xl font-bold gradient-text">
                {stats.confidenceScore}%
              </p>
              <p className="text-sm text-purple-600 mt-1">
                {stats.confidenceScore > 80 ? 'High accuracy' : 
                 stats.confidenceScore > 50 ? 'Moderate accuracy' : 'Low accuracy'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 removeprism prism-card p-6 rounded-xl dark:bg-[#1e1e1e]">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">Additional Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-300">Top Selling Location</h4>
              <p className="text-lg font-semibold text-purple-600">
                {stats.topSellingLocation || 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-300">Available Stock</h4>
              <p className="text-lg font-semibold text-purple-600">
                {stats.availableStock.toLocaleString()} units
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2 dark:text-gray-300">Last Updated</h4>
              <p className="text-lg font-semibold text-purple-600">
                {formatDate(stats.lastUpdated)}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;