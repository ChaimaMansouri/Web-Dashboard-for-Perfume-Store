import React from "react";
import { Search, Bell, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;