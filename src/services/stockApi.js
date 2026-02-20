import axios from 'axios';

const API_KEY = '9bdd64f6d0984dd2a66530a67736d7af';
const BASE_URL = 'https://api.twelvedata.com';

export const searchStocks = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/symbol_search`, {
      params: {
        symbol: query,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

export const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

export const getStockTimeSeries = async (symbol, interval = '1day', outputsize = 30) => {
  try {
    const response = await axios.get(`${BASE_URL}/time_series`, {
      params: {
        symbol: symbol,
        interval: interval,
        outputsize: outputsize,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching time series:', error);
    throw error;
  }
};

export const getStockProfile = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile`, {
      params: {
        symbol: symbol,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock profile:', error);
    throw error;
  }
};

export const getStockStatistics = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/statistics`, {
      params: {
        symbol: symbol,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock statistics:', error);
    throw error;
  }
};
