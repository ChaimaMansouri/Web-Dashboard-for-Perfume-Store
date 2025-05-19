import React from "react";
import Sidebar from "../components/Sidebar";
import { 
  Users2, 
  LineChart,
  Flower2,
  Wind,
  Droplet,
  Leaf
} from 'lucide-react';

const Home = () => {
  return (
    <div className="flex max-[700px]:flex-col min-h-screen bg-gray-100 dark:bg-[#272727]">
      <div className="z-10 max-[700px]:rounded-xl">
        <Sidebar />
      </div>

      <main className="flex-1 p-8 w-[70%] max-[700px]:w-full ml-[20%] max-[700px]:ml-0 max-[800px]:pb-[100px] pb-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img
              src="/images/perfume3.jpg"
              alt="Luxury Perfumes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 to-transparent flex items-center">
              <div className="px-12 max-[700px]:px-6">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Parfum Analytics</h1>
                <p className="text-lg text-purple-100 max-w-xl mb-6">
                  Your comprehensive dashboard for global perfume market analysis and trends.
                </p>
                <a href="/general" className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/30 text-base inline-block">
                  Explore Dashboard
                </a>
              </div>
            </div>
          </section>

          {/* Mission Statement */}
          <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-xl mb-12 transition-transform duration-300 hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-6">
              Understanding the Global Fragrance Market
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
              Our platform provides comprehensive analytics and insights into the global perfume industry, 
              helping you understand market trends, consumer preferences, and emerging opportunities across gender segments.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: "65%", label: "Market Growth in 2024" },
                { value: "10K+", label: "Fragrances Analyzed" },
                { value: "150+", label: "Countries Covered" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-300 mb-2">{stat.value}</div>
                  <p className="text-gray-600 dark:text-gray-400 text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Fragrance Notes Section */}
          <section className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-xl mb-12 transition-transform duration-300 hover:-translate-y-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Flower2 className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
              Popular Fragrance Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: 'Floral', icon: <Flower2 className="w-6 h-6" />, desc: 'Rose, Jasmine, Lily' },
                { name: 'Fresh', icon: <Wind className="w-6 h-6" />, desc: 'Citrus, Ocean, Green' },
                { name: 'Oriental', icon: <Droplet className="w-6 h-6" />, desc: 'Vanilla, Amber, Musk' },
                { name: 'Woody', icon: <Leaf className="w-6 h-6" />, desc: 'Sandalwood, Cedar, Vetiver' }
              ].map((note) => (
                <div 
                  key={note.name} 
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                      {note.icon}
                    </div>
                    <h3 className="ml-3 font-medium text-gray-900 dark:text-white text-base">{note.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{note.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Analytics Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {[
              { 
                title: "Women's Fragrances",
                image: "/images/download (3).jpg",
                gradient: "from-pink-900 to-pink-600",
                link:"/women"
              },
              { 
                title: "Men's Fragrances",
                image: "/images/Bleu de Chanel - Deep Blue.jpg",
                gradient: "from-blue-900 to-blue-600",
                link:"/men"
              },
              { 
                title: "Market Predictions",
                image: "/images/download.jpg",
                gradient: "from-yellow-900 to-yellow-600",
                link:"/predictions"
              }
            ].map((card, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-base">
                    {index === 0 && "Explore comprehensive data analytics for the women's fragrance market"}
                    {index === 1 && "Access detailed analytics for the men's fragrance segment"}
                    {index === 2 && "Leverage AI-powered predictions to forecast market trends"}
                  </p>
                  <a href={card.link}  className={`inline-block w-full text-center bg-gradient-to-r ${card.gradient} text-white py-2.5 px-6 rounded-xl text-base transition-all duration-300 hover:opacity-90`}>
                    View {index === 2 ? "Predictions" : "Dashboard"}
                  </a>
                </div>
              </div>
            ))}
          </section>

          {/* Footer */}
          <footer className="text-center text-gray-500 dark:text-gray-400 mt-12 pb-6 text-sm">
            <p>© 2025 Perfume Analytics Dashboard. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Home;