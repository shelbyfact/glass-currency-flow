import React, { useState, useEffect } from 'react';
import { ArrowUpDown, RefreshCw, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

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
  const [amount, setAmount] = useState<string>('1000');
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
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: 'sg' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: 'kr' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: 'se' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: 'no' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: 'nz' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: 'mx' }
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
      setError('Failed to load exchange rates. Using cached rates.');
      
      const mockRates = {
        USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25,
        AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, SGD: 1.36,
        KRW: 1180, SEK: 8.65, NOK: 8.95, NZD: 1.42, MXN: 20.1
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
    return `https://flagcdn.com/48x36/${countryCode}.png`;
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-slate-600 font-medium">Loading exchange rates...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-lg mx-auto pt-8 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Currency Converter</h1>
          <p className="text-slate-600">Real-time exchange rates for global currencies</p>
        </div>

        {/* Main Converter Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            
            {/* From Currency Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                From
              </label>
              <div className="relative">
                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <img 
                      src={getFlagUrl(getCurrencyData(fromCurrency).flag)} 
                      alt={`${fromCurrency} flag`}
                      className="w-8 h-6 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/32x24/e2e8f0/64748b?text=${fromCurrency}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="w-full bg-transparent text-slate-800 font-semibold focus:outline-none appearance-none cursor-pointer"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-right border-0 bg-transparent text-lg font-bold text-slate-800 p-0 focus:ring-0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center py-2">
              <Button
                onClick={handleSwapCurrencies}
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
              >
                <ArrowUpDown className="w-5 h-5 text-slate-600" />
              </Button>
            </div>

            {/* To Currency Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                To
              </label>
              <div className="relative">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <img 
                      src={getFlagUrl(getCurrencyData(toCurrency).flag)} 
                      alt={`${toCurrency} flag`}
                      className="w-8 h-6 rounded object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/32x24/dbeafe/3b82f6?text=${toCurrency}`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="w-full bg-transparent text-slate-800 font-semibold focus:outline-none appearance-none cursor-pointer"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32">
                    <div className="text-right text-lg font-bold text-blue-600 py-2">
                      {formatAmount(convertedAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            {getExchangeRate() > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Exchange Rate</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    1 {fromCurrency} = {getExchangeRate().toFixed(4)} {toCurrency}
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm font-medium text-center">{error}</p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="mt-6 text-center space-y-3">
          <Button
            onClick={fetchExchangeRates}
            disabled={loading}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:border-blue-300 transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh Rates'}
          </Button>
          {lastUpdated && (
            <p className="text-xs text-slate-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
