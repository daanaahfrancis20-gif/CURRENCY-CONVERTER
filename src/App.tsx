import { useState, useEffect, useMemo } from 'react';
import { 
  RefreshCw, 
  Coins, 
  ArrowLeftRight, 
  SlidersHorizontal, 
  AlertTriangle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import { ThemeId, ExchangeRatesData } from './types';
import { themes } from './data/themes';
import { fetchExchangeRates } from './utils/api';
import { getCurrencyInfo } from './data/currencies';

import CurrencyDropdown from './components/CurrencyDropdown';
import ThemeSelector from './components/ThemeSelector';
import MathBreakdown from './components/MathBreakdown';
import LiveRatesTicker from './components/LiveRatesTicker';
import QuickPresets from './components/QuickPresets';

export default function App() {
  // Theme state
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('global_converter_theme');
      if (saved && ['dark-obsidian', 'sunset-gold', 'forest-moss', 'glassmorphism'].includes(saved)) {
        return saved as ThemeId;
      }
    } catch (_) {}
    return 'dark-obsidian';
  });

  // Currency & input states
  const [amount, setAmount] = useState<number>(100);
  const [fromCurrency, setFromCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('global_converter_from_currency');
      if (saved) return saved;
    } catch (_) {}
    return 'USD';
  });
  const [toCurrency, setToCurrency] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('global_converter_to_currency');
      if (saved) return saved;
    } catch (_) {}
    return 'EUR';
  });

  // Rates fetching states
  const [ratesData, setRatesData] = useState<ExchangeRatesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // UX states
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);

  // Persistent settings
  useEffect(() => {
    try {
      localStorage.setItem('global_converter_theme', themeId);
    } catch (_) {}
  }, [themeId]);

  useEffect(() => {
    try {
      localStorage.setItem('global_converter_from_currency', fromCurrency);
    } catch (_) {}
  }, [fromCurrency]);

  useEffect(() => {
    try {
      localStorage.setItem('global_converter_to_currency', toCurrency);
    } catch (_) {}
  }, [toCurrency]);

  // Fetch rates
  const loadRates = async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      if (force) {
        localStorage.removeItem('global_currency_rates_cache');
      }
      const data = await fetchExchangeRates();
      setRatesData(data);
      setLastRefreshed(new Date(data.timestamp));
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch the latest rates. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Compute active theme config
  const activeTheme = useMemo(() => {
    return themes.find(t => t.id === themeId) || themes[0];
  }, [themeId]);

  // Extract available currency codes from rate data keys
  const availableCurrencyCodes = useMemo(() => {
    if (!ratesData) return ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
    return Object.keys(ratesData.rates).sort();
  }, [ratesData]);

  // Conversions math calculations
  const conversionRate = useMemo(() => {
    if (!ratesData) return 1;
    const fromRate = ratesData.rates[fromCurrency] || 1;
    const toRate = ratesData.rates[toCurrency] || 1;
    return toRate / fromRate;
  }, [ratesData, fromCurrency, toCurrency]);

  const convertedAmount = useMemo(() => {
    return amount * conversionRate;
  }, [amount, conversionRate]);

  // Swap action
  const handleSwap = () => {
    setSwapRotation(prev => prev + 180);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Preset quick list table
  const quickConversions = useMemo(() => {
    const values = [1, 5, 10, 50, 100, 250, 500, 1000];
    return values.map(val => ({
      amount: val,
      converted: val * conversionRate
    }));
  }, [conversionRate]);

  // Reverse conversions list
  const reverseConversions = useMemo(() => {
    const values = [1, 5, 10, 50, 100, 250, 500, 1000];
    const reverseRate = 1 / conversionRate;
    return values.map(val => ({
      amount: val,
      converted: val * reverseRate
    }));
  }, [conversionRate]);

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col ${activeTheme.backgroundClass} ${activeTheme.textPrimaryClass} antialiased`}>
      {/* Header Info */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2 shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              themeId === 'dark-obsidian' ? 'bg-[#66FCF1]/10 text-[#66FCF1]' : 'bg-current/10 text-inherit'
            }`}>
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1">
                Global Currency <span className={themeId === 'dark-obsidian' ? 'text-[#66FCF1]' : 'opacity-90'}>Converter</span>
              </h1>
              <p className={`text-xs ${activeTheme.textSecondaryClass} font-medium`}>
                Enterprise-grade real-time rates with offline cache capabilities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lastRefreshed && (
              <span className={`text-[11px] font-mono opacity-75 hidden sm:inline flex items-center gap-1 ${activeTheme.textSecondaryClass}`}>
                <Calendar className="w-3 h-3 inline-block" />
                Updated: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            
            <button
              id="refresh-rates-btn"
              onClick={() => loadRates(true)}
              disabled={isLoading}
              title="Force Refresh Rates"
              className={`p-2 rounded-xl border cursor-pointer ${activeTheme.inputClass} ${
                isLoading ? 'animate-spin opacity-50' : 'hover:scale-105 active:scale-95'
              } transition-all duration-200`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Core Section */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Theme Selection */}
        <ThemeSelector 
          currentThemeId={themeId} 
          onThemeChange={(id) => setThemeId(id)} 
          activeTheme={activeTheme}
        />

        {/* Loading / Error States */}
        {isLoading && !ratesData && (
          <div className={`p-12 text-center rounded-2xl border flex flex-col items-center justify-center gap-4 ${activeTheme.cardClass}`}>
            <RefreshCw className="w-10 h-10 animate-spin text-current opacity-70" />
            <div>
              <h3 className="font-bold text-lg">Fetching live exchange rates...</h3>
              <p className={`text-xs ${activeTheme.textSecondaryClass} mt-1`}>
                Contacting ExchangeRate API to download real-time rates map.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-start gap-3.5 shadow-lg">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm uppercase tracking-wide">Network Error Detected</h3>
              <p className="text-xs font-medium opacity-90">{error}</p>
              <button
                id="retry-fetch-btn"
                onClick={() => loadRates(true)}
                className="mt-2.5 px-3.5 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors"
              >
                Retry Request
              </button>
            </div>
          </div>
        )}

        {/* Primary Content (Shown when rates are loaded) */}
        {ratesData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: Main conversion panel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Main Converter Card */}
              <div id="main-converter-card" className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${activeTheme.cardClass}`}>
                
                {/* Inputs Row */}
                <div className="space-y-6">
                  
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="amount-input" className={`block text-xs font-semibold uppercase tracking-wider ${activeTheme.textSecondaryClass}`}>
                        Amount to Convert
                      </label>
                      <div className="flex items-center gap-1">
                        <SlidersHorizontal className={`w-3.5 h-3.5 opacity-60 ${activeTheme.textSecondaryClass}`} />
                        <select
                          id="decimal-places-select"
                          value={decimalPlaces}
                          onChange={(e) => setDecimalPlaces(Number(e.target.value))}
                          className={`text-xs bg-transparent border-none font-semibold focus:ring-0 cursor-pointer ${activeTheme.textSecondaryClass}`}
                        >
                          <option value="2" className="bg-slate-900 text-white">2 Decimals</option>
                          <option value="3" className="bg-slate-900 text-white">3 Decimals</option>
                          <option value="4" className="bg-slate-900 text-white">4 Decimals</option>
                          <option value="5" className="bg-slate-900 text-white">5 Decimals</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <input
                        id="amount-input"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Enter amount..."
                        value={amount === 0 ? '' : amount}
                        onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className={`w-full px-4 py-3.5 rounded-xl font-bold font-mono text-xl outline-none border transition-all ${activeTheme.inputClass}`}
                      />
                      <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono opacity-50 ${activeTheme.textSecondaryClass}`}>
                        {fromCurrency}
                      </span>
                    </div>

                    {/* Presets Row */}
                    <div className="pt-1">
                      <QuickPresets
                        currentAmount={amount}
                        onAmountChange={(val) => setAmount(val)}
                        theme={activeTheme}
                      />
                    </div>
                  </div>

                  {/* Dropdowns + Swap button Row */}
                  <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
                    
                    {/* From Dropdown */}
                    <div className="md:col-span-5">
                      <CurrencyDropdown
                        idPrefix="from"
                        label="From"
                        selectedCode={fromCurrency}
                        onChange={(code) => setFromCurrency(code)}
                        availableCodes={availableCurrencyCodes}
                        theme={activeTheme}
                      />
                    </div>

                    {/* Swap Button container */}
                    <div className="md:col-span-1 flex justify-center md:pt-6">
                      <button
                        id="swap-currencies-btn"
                        type="button"
                        onClick={handleSwap}
                        title="Swap Currencies"
                        className={`p-3 rounded-full cursor-pointer border ${activeTheme.inputClass} ${
                          themeId === 'dark-obsidian' ? 'hover:border-[#66FCF1] hover:bg-[#66FCF1]/10 text-[#66FCF1]' : 'hover:scale-105 active:scale-95'
                        } shadow-md transition-all duration-300`}
                        style={{
                          transform: `rotate(${swapRotation}deg)`,
                        }}
                      >
                        <ArrowLeftRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* To Dropdown */}
                    <div className="md:col-span-5">
                      <CurrencyDropdown
                        idPrefix="to"
                        label="To"
                        selectedCode={toCurrency}
                        onChange={(code) => setToCurrency(code)}
                        availableCodes={availableCurrencyCodes}
                        theme={activeTheme}
                      />
                    </div>

                  </div>

                  {/* Divider */}
                  <hr className={`border-t ${activeTheme.dividerClass}`} />

                  {/* Visual output section */}
                  <div className="space-y-1.5 text-center md:text-left py-2">
                    <div className={`text-sm font-semibold tracking-wide ${activeTheme.textSecondaryClass}`}>
                      {amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} {getCurrencyInfo(fromCurrency).name} =
                    </div>
                    <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-2">
                      <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                        themeId === 'dark-obsidian' ? 'text-[#66FCF1]' : ''
                      }`}>
                        {convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: decimalPlaces,
                          maximumFractionDigits: decimalPlaces
                        })}
                      </span>
                      <span className="text-xl sm:text-2xl font-black">{toCurrency}</span>
                    </div>
                    <div className={`text-xs opacity-75 font-mono ${activeTheme.textSecondaryClass}`}>
                      1 {fromCurrency} = {conversionRate.toFixed(6)} {toCurrency} | 1 {toCurrency} = {(1 / conversionRate).toFixed(6)} {fromCurrency}
                    </div>
                  </div>

                </div>

              </div>

              {/* Math Breakdown Panel */}
              <MathBreakdown
                amount={amount}
                fromCode={fromCurrency}
                toCode={toCurrency}
                fromRate={ratesData.rates[fromCurrency] || 1}
                toRate={ratesData.rates[toCurrency] || 1}
                convertedAmount={convertedAmount}
                theme={activeTheme}
                decimalPlaces={decimalPlaces}
              />

            </div>

            {/* Right Side: Common conversions comparison cards */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Popular Live Pairs Ticker */}
              <div className={`rounded-3xl p-5 border transition-all duration-300 ${activeTheme.cardClass}`}>
                <LiveRatesTicker rates={ratesData.rates} theme={activeTheme} />
              </div>

              {/* Quick Comparison Grids */}
              <div className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${activeTheme.cardClass} space-y-6`}>
                
                <div className="flex items-center gap-2">
                  <Layers className={`w-5 h-5 shrink-0 ${themeId === 'dark-obsidian' ? 'text-[#66FCF1]' : 'text-current opacity-80'}`} />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    Conversion Cheat Sheet
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column: From -> To */}
                  <div>
                    <h4 className="text-xs font-bold uppercase opacity-75 mb-2 px-1 text-center truncate">
                      {fromCurrency} <ArrowRight className="w-3 h-3 inline mx-0.5" /> {toCurrency}
                    </h4>
                    <div className={`rounded-xl overflow-hidden border ${activeTheme.dividerClass} divide-y ${activeTheme.dividerClass} text-xs font-mono bg-black/5`}>
                      {quickConversions.map((item) => (
                        <div key={item.amount} className="flex justify-between p-2.5 hover:bg-current/5 transition-colors">
                          <span className="font-semibold">{item.amount} {fromCurrency}</span>
                          <span className="font-bold">{item.converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: To -> From */}
                  <div>
                    <h4 className="text-xs font-bold uppercase opacity-75 mb-2 px-1 text-center truncate">
                      {toCurrency} <ArrowRight className="w-3 h-3 inline mx-0.5" /> {fromCurrency}
                    </h4>
                    <div className={`rounded-xl overflow-hidden border ${activeTheme.dividerClass} divide-y ${activeTheme.dividerClass} text-xs font-mono bg-black/5`}>
                      {reverseConversions.map((item) => (
                        <div key={item.amount} className="flex justify-between p-2.5 hover:bg-current/5 transition-colors">
                          <span className="font-semibold">{item.amount} {toCurrency}</span>
                          <span className="font-bold">{item.converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-6 px-4 mt-auto border-t shrink-0 opacity-80" style={{ borderTopColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs tracking-wide">
          Rates sourced via <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="underline font-semibold">ExchangeRate-API</a> and verified against <a href="https://frankfurter.dev" target="_blank" rel="noreferrer" className="underline font-semibold">Frankfurter.app</a>. Flags by <a href="https://flagcdn.com" target="_blank" rel="noreferrer" className="underline font-semibold">FlagCDN</a>.
        </p>
        <p className="text-[10px] opacity-60 mt-1">
          Developed in compliance with enterprise financial specifications. Caching is stored client-side.
        </p>
      </footer>
    </div>
  );
}
