import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchStocks } from '../services/stockApi';

const SearchBar = ({ onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) {
        handleSearch(query);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const data = await searchStocks(searchQuery);
      if (data.data) {
        setResults(data.data.slice(0, 8));
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStock = (stock) => {
    setQuery(`${stock.symbol} - ${stock.instrument_name}`);
    setShowDropdown(false);
    onSelectStock(stock);
  };

  return (
    <div className="relative mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          placeholder="Search stocks (e.g., AAPL, GOOGL, TSLA)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-96 rounded-lg py-2 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {results.map((stock, index) => (
            <div
              key={index}
              className="cursor-pointer select-none relative py-3 px-4 hover:bg-gray-50 transition-colors"
              onClick={() => handleSelectStock(stock)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900 text-base">{stock.symbol}</span>
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {stock.exchange}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 truncate">{stock.instrument_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{stock.country}</p>
                  <p className="text-xs text-gray-500">{stock.instrument_type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchBar;
