import React, { useState, useEffect } from "react";
const baseURL = import.meta.env.VITE_BACKEND_URL;


const Sidebar = () => {


  // dark mood 
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Back end
/**
 * Handles user logout process by:
 * 1. Sending a logout request to the server
 * 2. Clearing the authentication token from client-side storage
 * 3. Redirecting to the home page
 */
  const handleLogout = async () => {
    try {
       // Send POST request to server's logout endpoint
        const response = await fetch(`${baseURL}/logout`, { method: 'POST' });

        if (response.ok) {
          // 1. Remove the authentication token from localStorage
            localStorage.removeItem('token'); 
          // 2. Redirect to home page
          // Using window.location.href forces a full page reload which:
          // - Clears React state
          // - Ensures all protected routes re-check authentication
            window.location.href = '/'; 
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
};


  // Back end Code  End



  return (
    <section className="fixed p-5 max-[700px]:p-0 w-[20%] h-screen flex flex-col justify-between  z-10
                        mr-10 max-[700px]:bottom-0 max-[700px]:left-0 max-[700px]:w-full dark:text-gray-300
 
                        max-[700px]:h-20 max-[700px]:flex-row max-[700px]:items-center max-[700px]:justify-around bg-white dark:bg-[#1e1e1e] shadow-lg">
      {/* Logo (Hidden on small screens) */}
      <div className="max-[700px]:hidden">
        <img src="/images/—Pngtree—spa logo_8452078.png" alt="LOGO" className="w-full h-45 -mt-2 -ml-2" />
      </div>

      {/* Navigation Links */}
      <div>
      <ul className="space-y-6 max-[700px]:space-y-0 max-[700px]:flex max-[700px]:space-x-3 max-[580px]:space-x-8 max-[370px]:space-x-4">
    
          <li className=" flex items-center space-x-2 max-[700px]:space-x-1 
            transition-all duration-300 ease-in-out 
            hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <a href="/home"><span className="material-symbols-outlined  text-gradient ">home_app_logo</span></a>
            <a href="/home" className="max-[580px]:hidden">Home</a>
          </li>
          <li className="flex items-center space-x-2 max-[700px]:space-x-1 
            transition-all duration-300 ease-in-out 
            hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <a href="/general"><span className="material-symbols-outlined text-gradient">dashboard</span></a>
            <a href="/general" className="max-[580px]:hidden">General</a>
          </li>

          <li className="flex items-center space-x-2 max-[700px]:space-x-1 
            transition-all duration-300 ease-in-out 
            hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <a href="/women"><span className="material-symbols-outlined text-gradient">woman</span></a>
            <a href="/women" className="max-[580px]:hidden">Women</a>
          </li>
          <li className="flex items-center space-x-2 max-[700px]:space-x-1 
            transition-all duration-300 ease-in-out 
            hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <a href="/men"><span className="material-symbols-outlined text-gradient">man</span></a>
            <a href="/men" className="max-[580px]:hidden">Men</a>
          </li>
          <li className="flex items-center space-x-2 max-[700px]:space-x-1 
            transition-all duration-300 ease-in-out 
            hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <a href="/predictions"><span className="material-symbols-outlined text-gradient">troubleshoot</span></a>
            <a href="/predictions" className="max-[580px]:hidden">Predictions</a>
          </li>
          <li><button
            onClick={() => {
              setDarkMode(!darkMode);
              setTimeout(() => window.location.reload(), 100);
            }}
            className="flex gap-2 max-[780px]:gap-1 rounded-md text-black dark:text-white transition-all duration-300 ease-in-out 
                  hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105">
            <span className="material-symbols-outlined text-gradient">
              {darkMode ? "light_mode" : "dark_mode"}
            </span>
            <span className="max-[700px]:hidden">{darkMode ? " Light Mode" : " Dark Mode"}</span>
          </button></li>
          <li className="flex items-center space-x-2
        transition-all duration-300 ease-in-out 
        hover:bg-[#f5e8ff] dark:hover:bg-[#3a393a] hover:rounded-lg hover:px-2 hover:py-2 hover:scale-105" onClick={handleLogout}>
        <span className="material-symbols-outlined text-gradient dark:text-gray-300">logout</span>
        <a href="#" className="max-[580px]:hidden bg-black
                              text-transparent bg-clip-text dark:text-gray-300">
          Logout
        </a>
      </li>
     </ul>

      </div>

      
    </section>
  );
};

export default Sidebar;
