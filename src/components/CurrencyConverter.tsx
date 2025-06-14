import React, { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, DollarSign } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1000.00');
  const [fromCurrency, setFromCurrency] = useState<string>('INR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const currencies: CurrencyData[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: 'us' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: 'eu' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: 'gb' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: 'jp' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: 'ca' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: 'au' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: 'ch' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: 'cn' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: 'in' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'sg' }
  ];

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency] && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
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
      
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      const rates = { USD: 1, ...data.rates };
      setExchangeRates(rates);
      setLastUpdated(new Date().toLocaleTimeString());
      
      console.log('Exchange rates fetched successfully:', rates);
    } catch (err) {
      console.error('Error fetching exchange rates:', err);
      setError('Failed to load exchange rates. Please try again.');
      
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
        SGD: 1.36
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

  const getExchangeRate = () => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const usdToFrom = 1 / exchangeRates[fromCurrency];
      const rate = usdToFrom * exchangeRates[toCurrency];
      return rate;
    }
    return 0;
  };

  const getCurrencyData = (code: string) => {
    return currencies.find(c => c.code === code) || currencies[0];
  };

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode}.png`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-24 h-24 bg-green-200 rounded-full opacity-30"></div>
        <div className="absolute top-40 right-16 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-purple-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-sm mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Currency Converter</h1>
          <p className="text-gray-600 text-sm">Check live rates, set rate alerts, receive notifications and more.</p>
        </div>

        {/* Main converter card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          {/* Amount section */}
          <div className="mb-6">
            <label className="block text-gray-500 text-sm mb-3">Amount</label>
            <div className="flex items-center bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center mr-3 min-w-0 flex-shrink-0">
                <img 
                  src={getFlagUrl(getCurrencyData(fromCurrency).flag)} 
                  alt={`${fromCurrency} flag`}
                  className="w-6 h-4 mr-2 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none appearance-none min-w-0"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
                <svg className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-right text-lg font-semibold text-gray-800 focus:outline-none flex-1 min-w-0"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleSwapCurrencies}
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowUpDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Converted amount section */}
          <div className="mb-6">
            <label className="block text-gray-500 text-sm mb-3">Converted Amount</label>
            <div className="flex items-center bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center mr-3 min-w-0 flex-shrink-0">
                <img 
                  src={getFlagUrl(getCurrencyData(toCurrency).flag)} 
                  alt={`${toCurrency} flag`}
                  className="w-6 h-4 mr-2 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none appearance-none min-w-0"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
                <svg className="w-3 h-3 text-gray-400 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-right text-lg font-semibold text-gray-800 flex-1 min-w-0 truncate">
                {convertedAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Exchange rate info */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-1">Indicative Exchange Rate</p>
            {getExchangeRate() > 0 && (
              <p className="text-gray-800 font-semibold text-sm">
                1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
              </p>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 rounded-2xl p-4 border border-red-200">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Refresh button */}
        <div className="text-center">
          <button
            onClick={fetchExchangeRates}
            disabled={loading}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-6 py-3 text-gray-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Refresh Rates'}
          </button>
          {lastUpdated && (
            <p className="text-gray-500 text-xs mt-2">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
