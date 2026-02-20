import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import StockDetails from './components/StockDetails';
import TrendingStocks from './components/TrendingStocks';
import './App.css';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('stockFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('stockFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (stock) => {
    setFavorites(prev => {
      const exists = prev.find(fav => fav.symbol === stock.symbol);
      if (exists) {
        return prev.filter(fav => fav.symbol !== stock.symbol);
      } else {
        return [...prev, stock];
      }
    });
  };

  const isFavorite = (symbol) => {
    return favorites.some(fav => fav.symbol === symbol);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Search</h1>
            </div>
            {favorites.length > 0 && (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">{favorites.length} Favorites</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSelectStock={setSelectedStock} />
        
        {selectedStock ? (
          <StockDetails 
            stock={selectedStock} 
            isFavorite={isFavorite(selectedStock.symbol)}
            onToggleFavorite={() => toggleFavorite(selectedStock)}
          />
        ) : (
          <div className="space-y-8">
            {/* Trending Stocks */}
            <TrendingStocks onSelectStock={setSelectedStock} />
            
            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Favorites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((stock, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedStock(stock)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                          <p className="text-sm text-gray-500 truncate">{stock.instrument_name}</p>
                        </div>
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty State */}
            <div className="text-center py-20">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Search for stocks</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by searching for a stock symbol or company name.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
