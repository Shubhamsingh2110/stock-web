import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { getStockTimeSeries } from '../services/stockApi';

const StockChart = ({ timeSeries, symbol, timeRange, onTimeRangeChange }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previousClose, setPreviousClose] = useState(null);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredTime, setHoveredTime] = useState(null);
  const [currentSelectedRange, setCurrentSelectedRange] = useState('1D');

  const timeRanges = [
    { label: '1D', value: '1min', interval: '5min', outputsize: 78 }, // Market hours: 9:30 AM - 4:00 PM (78 points at 5-min intervals)
    { label: '5D', value: '5day', interval: '1day', outputsize: 5 }, // Previous 5 trading days
    { label: '1M', value: '1day', interval: '1day', outputsize: 30 },
    { label: '6M', value: '1day', interval: '1day', outputsize: 130 },
    { label: '1Y', value: '1week', interval: '1day', outputsize: 252 },
    { label: 'Max', value: '1month', interval: '1week', outputsize: 260 },
  ];

  const handleTimeRangeChange = async (range) => {
    setIsLoading(true);
    setCurrentSelectedRange(range.label);
    onTimeRangeChange(range.interval);
    
    try {
      const data = await getStockTimeSeries(symbol, range.interval, range.outputsize);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching time series:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeSeries && timeSeries.values && timeSeries.values.length > 0) {
      setChartData(timeSeries);
      // Set previous close as the first value's close price
      const firstValue = timeSeries.values[timeSeries.values.length - 1];
      if (firstValue) {
        setPreviousClose(parseFloat(firstValue.close));
      }
    }
  }, [timeSeries]);

  if (!chartData || !chartData.values || chartData.values.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Chart</h3>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleTimeRangeChange(range)}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-yellow-900">Chart Data Not Available</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Historical chart data may require a premium API subscription. 
                <a 
                  href="https://twelvedata.com/pricing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline ml-1 hover:text-yellow-900"
                >
                  Upgrade to access advanced features
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for Recharts
  const values = chartData.values.slice(0, 150).reverse();
  const formattedData = values.map((value) => ({
    time: value.datetime,
    price: parseFloat(value.close),
    high: parseFloat(value.high || value.close),
    low: parseFloat(value.low || value.close),
    volume: parseInt(value.volume || 0)
  }));

  const prices = formattedData.map(d => d.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  
  const firstPrice = formattedData[0]?.price || 0;
  const lastPrice = formattedData[formattedData.length - 1]?.price || 0;
  const priceChange = lastPrice - firstPrice;
  const percentChange = firstPrice !== 0 ? ((priceChange / firstPrice) * 100) : 0;
  const isPositive = priceChange >= 0;

  const currentRange = timeRanges.find(r => r.label === currentSelectedRange) || timeRanges[0];
  
  // Format time based on range
  const formatTime = (datetime) => {
    const date = new Date(datetime);
    if (currentRange.label === '1D') {
      // Show time for 1D (9:30 AM, 10:00 AM, etc.)
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (currentRange.label === '5D' || currentRange.label === '1M' || currentRange.label === '6M') {
      // Show date for 5D, 1M, 6M (15 Feb, 16 Feb, etc.)
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } else {
      // Show month and year for 1Y and Max
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      setHoveredPrice(data.price);
      setHoveredTime(data.time);
      
      const date = new Date(data.time);
      let timeDisplay;
      
      if (currentRange.label === '1D') {
        // For 1D, show time only (market hours: 9:30 AM - 4:00 PM)
        timeDisplay = date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      } else if (currentRange.label === '5D') {
        // For 5D, show day and date
        timeDisplay = date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        // For other ranges, use formatTime
        timeDisplay = formatTime(data.time);
      }
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-gray-900">${data.price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{timeDisplay}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick
  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#6b7280"
          fontSize={12}
        >
          {payload.value.toFixed(2)}
        </text>
      </g>
    );
  };

  // Custom X-axis tick
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={11}
        >
          {formatTime(payload.value)}
        </text>
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Chart</h3>
          <div className={`flex items-center mt-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-semibold">
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%)
            </span>
            <span className="ml-2 text-gray-500">
              {currentRange.label}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleTimeRangeChange(range)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                range.label === currentSelectedRange
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
              }`}
            >
              {isLoading && range.label === currentSelectedRange ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                range.label
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="relative bg-white rounded-lg border border-gray-200 p-4">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 50, left: 0, bottom: 20 }}
            onMouseMove={() => {}}
            onMouseLeave={() => {
              setHoveredPrice(null);
              setHoveredTime(null);
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            
            {/* Grid */}
            <CartesianGrid 
              strokeDasharray="0" 
              stroke="#f3f4f6" 
              vertical={false}
            />
            
            {/* X Axis */}
            <XAxis
              dataKey="time"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            
            {/* Y Axis */}
            <YAxis
              domain={['auto', 'auto']}
              tick={<CustomYAxisTick />}
              axisLine={false}
              tickLine={false}
              orientation="right"
              tickCount={6}
            />
            
            {/* Tooltip */}
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            
            {/* Previous Close Reference Line */}
            {previousClose && (
              <ReferenceLine
                y={previousClose}
                stroke="#9ca3af"
                strokeDasharray="4 2"
                strokeWidth={1}
                label={{
                  value: 'Previous close',
                  position: 'insideTopLeft',
                  fill: '#6b7280',
                  fontSize: 11
                }}
              />
            )}
            
            {/* Area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill="url(#colorPrice)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Price info on hover */}
        {hoveredPrice && (
          <div className="absolute top-6 left-6">
            <div className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ${hoveredPrice.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(hoveredTime)}
            </div>
          </div>
        )}
      </div>

      {/* Data points info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{formattedData.length} data points</span>
          <span>•</span>
          <span>Range: ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>
        </div>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default StockChart;
