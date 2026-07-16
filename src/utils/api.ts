import { ExchangeRatesData } from '../types';

const CACHE_KEY = 'global_currency_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_URL = 'https://open.er-api.com/v6/latest/USD';

export async function fetchExchangeRates(): Promise<ExchangeRatesData> {
  // Check localStorage cache first
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed: ExchangeRatesData = JSON.parse(cachedData);
      const now = Date.now();
      
      // If cached data is younger than 24 hours, return it
      if (now - parsed.timestamp < CACHE_DURATION) {
        console.log('Serving exchange rates from 24h cache');
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading exchange rates cache from localStorage:', err);
  }

  // Fetch fresh rates
  console.log('Fetching fresh exchange rates from API...');
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.result !== 'success' || !data.rates) {
    throw new Error('Invalid response structure from exchange rate API');
  }

  const ratesData: ExchangeRatesData = {
    base: data.base_code,
    date: data.time_last_update_utc,
    rates: data.rates,
    timestamp: Date.now(),
  };

  // Cache in localStorage
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(ratesData));
  } catch (err) {
    console.warn('Error saving exchange rates cache to localStorage:', err);
  }

  return ratesData;
}
