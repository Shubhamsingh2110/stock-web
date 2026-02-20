import React from 'react';

const StockStats = ({ quote, profile, stock }) => {
  const stats = [
    {
      label: 'Previous Close',
      value: quote.previous_close ? `$${parseFloat(quote.previous_close).toFixed(2)}` : 'N/A'
    },
    {
      label: 'Day Range',
      value: quote.low && quote.high ? `$${parseFloat(quote.low).toFixed(2)} - $${parseFloat(quote.high).toFixed(2)}` : 'N/A'
    },
    {
      label: '52 Week Range',
      value: quote.fifty_two_week?.low && quote.fifty_two_week?.high 
        ? `$${parseFloat(quote.fifty_two_week.low).toFixed(2)} - $${parseFloat(quote.fifty_two_week.high).toFixed(2)}` 
        : 'N/A'
    },
    {
      label: 'Volume',
      value: quote.volume ? parseInt(quote.volume).toLocaleString() : 'N/A'
    },
    {
      label: 'Average Volume',
      value: quote.average_volume ? parseInt(quote.average_volume).toLocaleString() : 'N/A'
    },
    {
      label: 'Market Cap',
      value: quote.market_cap ? formatMarketCap(quote.market_cap) : 'N/A'
    },
    {
      label: 'P/E Ratio',
      value: quote.pe_ratio ? parseFloat(quote.pe_ratio).toFixed(2) : 'N/A'
    },
    {
      label: 'EPS',
      value: quote.eps ? `$${parseFloat(quote.eps).toFixed(2)}` : 'N/A'
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Company Profile if available */}
      {profile && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {profile.name && (
              <div>
                <span className="text-gray-500">Company: </span>
                <span className="text-gray-900 font-medium">{profile.name}</span>
              </div>
            )}
            {profile.sector && (
              <div>
                <span className="text-gray-500">Sector: </span>
                <span className="text-gray-900 font-medium">{profile.sector}</span>
              </div>
            )}
            {profile.industry && (
              <div>
                <span className="text-gray-500">Industry: </span>
                <span className="text-gray-900 font-medium">{profile.industry}</span>
              </div>
            )}
            {profile.country && (
              <div>
                <span className="text-gray-500">Country: </span>
                <span className="text-gray-900 font-medium">{profile.country}</span>
              </div>
            )}
            {profile.employees && (
              <div>
                <span className="text-gray-500">Employees: </span>
                <span className="text-gray-900 font-medium">{parseInt(profile.employees).toLocaleString()}</span>
              </div>
            )}
            {profile.website && (
              <div>
                <span className="text-gray-500">Website: </span>
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
          {profile.description && (
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed">{profile.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Exchange Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-gray-500">Exchange: </span>
            <span className="text-gray-900 font-medium">{stock.exchange}</span>
          </div>
          <div>
            <span className="text-gray-500">Currency: </span>
            <span className="text-gray-900 font-medium">{quote.currency || 'USD'}</span>
          </div>
          <div>
            <span className="text-gray-500">Type: </span>
            <span className="text-gray-900 font-medium">{stock.instrument_type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format market cap
const formatMarketCap = (value) => {
  const num = parseFloat(value);
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export default StockStats;
