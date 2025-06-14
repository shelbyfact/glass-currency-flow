
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, DollarSign } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const currencies: CurrencyData[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
  ];

  const popularPairs = [
    { from: 'USD', to: 'EUR' },
    { from: 'USD', to: 'GBP' },
    { from: 'EUR', to: 'GBP' },
    { from: 'USD', to: 'JPY' }
  ];

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency] && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        // Convert through USD as base currency
        const usdAmount = numAmount / exchangeRates[fromCurrency];
        const converted = usdAmount * exchangeRates[toCurrency];
        setConvertedAmount(converted);
      }
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Using exchangerate-api.com (free tier)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      // Add USD as base currency with rate 1
      const rates = { USD: 1, ...data.rates };
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('Exchange rates fetched successfully:', rates);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Failed to load exchange rates. Please try again.');
      
      // Fallback mock data for demo purposes
      const mockRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        CNY: 6.45,
        INR: 74.5,
        BRL: 5.2
      };
      setExchangeRates(mockRates);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleQuickConvert = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const getExchangeRate = () => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const usdToFrom = 1 / exchangeRates[fromCurrency];
      const rate = usdToFrom * exchangeRates[toCurrency];
      return rate;
    }
    return 0;
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + (currency ? ` ${currency.symbol}` : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-white/20 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-3 border border-white/20">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Currency Converter</h1>
          <p className="text-white/80 text-sm">Real-time exchange rates</p>
          {lastUpdated && (
            <p className="text-white/60 text-xs mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 backdrop-blur-md bg-red-500/20 rounded-2xl p-4 border border-red-300/30">
            <p className="text-white text-sm text-center">{error}</p>
          </div>
        )}

        {/* Main converter card */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
          {/* Amount input */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
              placeholder="Enter amount"
            />
          </div>

          {/* From Currency */}
          <div className="mb-4">
            <label className="block text-white/90 text-sm font-medium mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleSwapCurrencies}
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 rounded-full p-3 transition-all duration-200 hover:scale-110 group"
            >
              <ArrowUpDown className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* To Currency */}
          <div className="mb-6">
            <label className="block text-white/90 text-sm font-medium mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-gray-800 text-white">
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 border border-white/20">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">Converted Amount</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(convertedAmount, toCurrency)}
              </p>
              {getExchangeRate() > 0 && (
                <p className="text-white/60 text-xs mt-2">
                  1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Popular pairs */}
        <div className="backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 text-white mr-2" />
            <h3 className="text-white font-semibold">Popular Pairs</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {popularPairs.map((pair, index) => (
              <button
                key={index}
                onClick={() => handleQuickConvert(pair.from, pair.to)}
                className="backdrop-blur-md bg-white/5 hover:bg-white/15 border border-white/20 rounded-xl p-3 transition-all duration-200 hover:scale-105 group"
              >
                <div className="text-white text-sm font-medium">
                  {pair.from}/{pair.to}
                </div>
                {exchangeRates[pair.from] && exchangeRates[pair.to] && (
                  <div className="text-white/70 text-xs mt-1">
                    {((1 / exchangeRates[pair.from]) * exchangeRates[pair.to]).toFixed(4)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Refresh button */}
        <div className="text-center">
          <button
            onClick={fetchExchangeRates}
            disabled={loading}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/30 rounded-2xl px-6 py-3 text-white font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Refresh Rates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
