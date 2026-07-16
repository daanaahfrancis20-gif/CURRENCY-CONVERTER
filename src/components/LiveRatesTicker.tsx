import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { ThemeConfig } from '../types';

interface LiveRatesTickerProps {
  rates: Record<string, number>;
  theme: ThemeConfig;
}

export default function LiveRatesTicker({ rates, theme }: LiveRatesTickerProps) {
  // Define popular pairs and how to compute their rates
  const pairs = [
    { name: 'EUR / USD', getRate: () => 1 / (rates['EUR'] || 1.08) },
    { name: 'GBP / USD', getRate: () => 1 / (rates['GBP'] || 0.79) },
    { name: 'USD / JPY', getRate: () => rates['JPY'] || 155.4 },
    { name: 'USD / CAD', getRate: () => rates['CAD'] || 1.36 },
    { name: 'AUD / USD', getRate: () => 1 / (rates['AUD'] || 1.51) },
    { name: 'USD / CHF', getRate: () => rates['CHF'] || 0.89 },
    { name: 'USD / INR', getRate: () => rates['INR'] || 83.4 }
  ];

  const formatRate = (rate: number) => {
    if (rate > 100) return rate.toFixed(2);
    return rate.toFixed(4);
  };

  return (
    <div className="w-full" id="live-rates-ticker-container">
      <div className="flex items-center gap-1.5 mb-2.5">
        <TrendingUp className="w-4 h-4 opacity-75 shrink-0" />
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme.textSecondaryClass}`}>
          Popular Live Pairs (Derived)
        </h3>
      </div>
      
      {/* Horizontally Scrollable Grid */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1 flex gap-3 custom-scrollbar">
        {pairs.map((pair) => {
          let value = 1;
          try {
            value = pair.getRate();
          } catch (e) {
            console.error(e);
          }
          
          return (
            <div
              id={`ticker-pair-${pair.name.replace(/\s+/g, '').toLowerCase()}`}
              key={pair.name}
              className={`flex-none flex items-center justify-between p-3.5 rounded-xl border ${
                theme.dividerClass
              } ${
                theme.id === 'dark-obsidian' ? 'bg-[#1F2833]/50 hover:border-[#66FCF1]/40' : 'bg-current/5 hover:bg-current/10'
              } min-w-[130px] transition-all duration-300`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold block tracking-tight">{pair.name}</span>
                <span className="font-mono text-sm font-semibold tracking-wider">
                  {formatRate(value)}
                </span>
              </div>
              <ArrowUpRight className={`w-3.5 h-3.5 opacity-60 ml-1 shrink-0 ${
                theme.id === 'dark-obsidian' ? 'text-[#66FCF1]' : 'text-current'
              }`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
