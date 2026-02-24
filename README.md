# Stock Search App

A modern stock search application built with React, Vite, and TailwindCSS. Search and view detailed information about stocks with a Google Finance-inspired UI.

## Features


- 🔍 **Real-time Stock Search** - Search for stocks by symbol or company name
- 📊 **Detailed Stock Information** - View comprehensive stock data including:
  - Current price and price changes
  - Opening/closing prices
  - Daily high/low
  - Volume and market cap
  - P/E ratio and EPS
  - 52-week range
- 📈 **Interactive Charts** - Visualize stock performance over time
- 💼 **Company Profiles** - View company information and statistics
- 🎨 **Modern UI** - Clean, responsive design inspired by Google Finance

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **TwelveData API** - Stock market data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Enter a stock symbol (e.g., AAPL, GOOGL, TSLA) or company name in the search bar
2. Select a stock from the dropdown results
3. View detailed information including:
   - Real-time price and changes
   - Interactive price chart
   - Key statistics and metrics
   - Company profile and information

## API

This application uses the [TwelveData API](https://twelvedata.com/) to fetch stock market data.

## Project Structure

```
stocks/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── StockDetails.jsx
│   │   ├── StockChart.jsx
│   │   └── StockStats.jsx
│   ├── services/
│   │   └── stockApi.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## License

MIT

## Author

Built with ❤️ using React, Vite, and TailwindCSS
