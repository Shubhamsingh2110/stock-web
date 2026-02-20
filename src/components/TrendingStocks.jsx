import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingStocks = ({ onSelectStock }) => {
  // Popular stocks to suggest
  const trendingStocks = [
    { symbol: 'AAPL', instrument_name: 'Apple Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'GOOGL', instrument_name: 'Alphabet Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'MSFT', instrument_name: 'Microsoft Corporation', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'AMZN', instrument_name: 'Amazon.com Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'TSLA', instrument_name: 'Tesla Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'NVDA', instrument_name: 'NVIDIA Corporation', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'META', instrument_name: 'Meta Platforms Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
    { symbol: 'NFLX', instrument_name: 'Netflix Inc', exchange: 'NASDAQ', instrument_type: 'Common Stock', country: 'US' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Trending Stocks</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trendingStocks.map((stock, index) => (
          <div
            key={index}
            onClick={() => onSelectStock(stock)}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                {stock.symbol}
              </span>
              <svg 
                className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 truncate">{stock.instrument_name}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400">{stock.exchange}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Popular Suggestions</h3>
            <p className="text-sm text-blue-700 mt-1">
              Click on any stock to view detailed information, charts, and statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingStocks;
