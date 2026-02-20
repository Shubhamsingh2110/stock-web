import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Heart } from 'lucide-react';
import { getStockQuote, getStockProfile, getStockTimeSeries } from '../services/stockApi';
import StockChart from './StockChart';
import StockStats from './StockStats';

// Helper function to format market cap
const formatMarketCap = (value) => {
  const num = parseFloat(value);
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toLocaleString();
};

const StockDetails = ({ stock, isFavorite, onToggleFavorite }) => {
  const [quote, setQuote] = useState(null);
  const [profile, setProfile] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1day');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const [quoteData, profileData, timeSeriesData] = await Promise.all([
          getStockQuote(stock.symbol),
          getStockProfile(stock.symbol).catch(() => null),
          getStockTimeSeries(stock.symbol, timeRange, 30)
        ]);
        
        setQuote(quoteData);
        setProfile(profileData);
        setTimeSeries(timeSeriesData);
        
        // Check for API limitations
        if (quoteData?.code === 429 || quoteData?.status === 'error') {
          setApiError({
            type: 'rate_limit',
            message: 'API rate limit reached. Please upgrade to a paid plan for more requests.'
          });
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        if (error.response?.status === 429) {
          setApiError({
            type: 'rate_limit',
            message: 'API rate limit reached. Please wait or upgrade to a paid plan.'
          });
        } else if (error.response?.status === 403) {
          setApiError({
            type: 'premium_required',
            message: 'This data requires a premium API plan. Please upgrade your subscription.'
          });
        } else {
          setApiError({
            type: 'general',
            message: 'Unable to fetch stock data. Please try again later.'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (stock) {
      fetchStockData();
    }
  }, [stock, timeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Unable to load stock data. Please try another symbol.</p>
      </div>
    );
  }

  const priceChange = parseFloat(quote.change || 0);
  const percentChange = parseFloat(quote.percent_change || 0);
  const isPositive = priceChange >= 0;

  return (
    <div className="space-y-6">
      {/* API Error Alert */}
      {apiError && (
        <div className={`rounded-lg p-4 ${
          apiError.type === 'premium_required' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <svg 
              className={`w-5 h-5 mt-0.5 mr-3 ${
                apiError.type === 'premium_required' ? 'text-yellow-600' : 'text-red-600'
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className={`text-sm font-semibold ${
                apiError.type === 'premium_required' ? 'text-yellow-900' : 'text-red-900'
              }`}>
                {apiError.type === 'premium_required' ? 'Premium API Required' : 'API Limit Reached'}
              </h3>
              <p className={`text-sm mt-1 ${
                apiError.type === 'premium_required' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {apiError.message}
              </p>
              <a 
                href="https://twelvedata.com/pricing" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center mt-2 text-sm font-medium ${
                  apiError.type === 'premium_required' ? 'text-yellow-800 hover:text-yellow-900' : 'text-red-800 hover:text-red-900'
                }`}
              >
                View Pricing Plans
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Stock Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">{stock.symbol}</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {stock.exchange}
              </span>
              <button
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>
            <p className="mt-1 text-lg text-gray-600">{stock.instrument_name}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-normal text-gray-900">
              ${parseFloat(quote.close || quote.price || 0).toFixed(2)}
              <span className="text-lg text-gray-500 ml-2">USD</span>
            </div>
            <div className={`flex items-center justify-end mt-2 text-base ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5 mr-1" /> : <TrendingDown className="w-5 h-5 mr-1" />}
              <span className="font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
              </span>
              <span className="text-sm text-gray-500 ml-2">today</span>
            </div>
            {/* {quote.timestamp && (
              <p className="mt-2 text-sm text-gray-500">
                Closed: {new Date(quote.timestamp * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
            )} */}
            {quote.is_market_open === false && (
              <div className="mt-2 text-sm">
                <span className="text-gray-700">Pre-market </span>
                <span className={`font-medium ${parseFloat(quote.extended_change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {quote.extended_price ? `${parseFloat(quote.extended_price).toFixed(2)}` : ''}
                  {quote.extended_change ? ` ${parseFloat(quote.extended_change) >= 0 ? '+' : ''}${parseFloat(quote.extended_change).toFixed(2)}` : ''}
                  {quote.extended_percent_change ? ` (${parseFloat(quote.extended_percent_change) >= 0 ? '+' : ''}${parseFloat(quote.extended_percent_change).toFixed(2)}%)` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-base font-normal text-gray-900">
              {parseFloat(quote.open || 0).toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">High</p>
            <p className="text-base font-normal text-gray-900">
              {parseFloat(quote.high || 0).toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Low</p>
            <p className="text-base font-normal text-gray-900">
              {parseFloat(quote.low || 0).toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Mkt cap</p>
            <p className="text-base font-normal text-gray-900">
              {quote.market_cap ? formatMarketCap(quote.market_cap) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">P/E ratio</p>
            <p className="text-base font-normal text-gray-900">
              {quote.pe_ratio ? parseFloat(quote.pe_ratio).toFixed(2) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Dividend yield</p>
            <p className="text-base font-normal text-gray-900">
              {quote.dividend_yield ? `${parseFloat(quote.dividend_yield).toFixed(2)}%` : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">52-wk high</p>
            <p className="text-base font-normal text-gray-900">
              {quote.fifty_two_week?.high ? parseFloat(quote.fifty_two_week.high).toFixed(2) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">52-wk low</p>
            <p className="text-base font-normal text-gray-900">
              {quote.fifty_two_week?.low ? parseFloat(quote.fifty_two_week.low).toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {timeSeries && (
        <StockChart 
          timeSeries={timeSeries} 
          symbol={stock.symbol}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      )}

      {/* Additional Stats */}
      <StockStats quote={quote} profile={profile} stock={stock} />
    </div>
  );
};

export default StockDetails;
