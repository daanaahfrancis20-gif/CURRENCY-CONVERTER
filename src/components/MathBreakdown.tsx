import { Info, HelpCircle } from 'lucide-react';
import { ThemeConfig } from '../types';

interface MathBreakdownProps {
  amount: number;
  fromCode: string;
  toCode: string;
  fromRate: number;
  toRate: number;
  convertedAmount: number;
  theme: ThemeConfig;
  decimalPlaces: number;
}

export default function MathBreakdown({
  amount,
  fromCode,
  toCode,
  fromRate,
  toRate,
  convertedAmount,
  theme,
  decimalPlaces,
}: MathBreakdownProps) {
  // Calculate cross rate (Rate of target relative to source)
  const crossRate = toRate / fromRate;

  // Format numbers nicely
  const formatVal = (val: number, maxDecimals = 6) => {
    return Number(val.toFixed(maxDecimals)).toLocaleString(undefined, {
      minimumFractionDigits: Math.min(2, maxDecimals),
      maximumFractionDigits: maxDecimals,
    });
  };

  return (
    <div
      id="math-breakdown-panel"
      className={`rounded-2xl p-5 border transition-all duration-300 ${theme.cardClass}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className={`w-5 h-5 shrink-0 ${theme.id === 'dark-obsidian' ? 'text-[#66FCF1]' : 'text-current opacity-80'}`} />
        <h3 className="font-bold text-sm tracking-wide uppercase">
          Mathematical Breakdown
        </h3>
      </div>

      <div className="space-y-4 text-xs sm:text-sm">
        {/* Step-by-Step explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3.5 rounded-xl border ${theme.dividerClass} bg-black/5`}>
            <span className={`block text-xs font-semibold uppercase opacity-75 mb-1 ${theme.textSecondaryClass}`}>
              1. Rates Relative to USD (Base)
            </span>
            <div className="space-y-1 font-mono">
              <div>1 USD = <span className="font-bold">{formatVal(fromRate, 4)}</span> {fromCode}</div>
              <div>1 USD = <span className="font-bold">{formatVal(toRate, 4)}</span> {toCode}</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${theme.dividerClass} bg-black/5`}>
            <span className={`block text-xs font-semibold uppercase opacity-75 mb-1 ${theme.textSecondaryClass}`}>
              2. Derived Cross Exchange Rate
            </span>
            <div className="space-y-1">
              <div className="font-mono">
                1 {fromCode} = <span className="opacity-75">{formatVal(toRate, 4)} / {formatVal(fromRate, 4)}</span>
              </div>
              <div className="text-sm font-semibold">
                1 {fromCode} = <span className={`font-mono text-base font-bold ${theme.id === 'dark-obsidian' ? 'text-[#66FCF1]' : 'text-current'}`}>{formatVal(crossRate, decimalPlaces)}</span> {toCode}
              </div>
            </div>
          </div>
        </div>

        {/* The Equation container */}
        <div className={`p-4 rounded-xl border ${theme.dividerClass} bg-current/5 flex flex-col justify-center items-center text-center`}>
          <span className={`text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textSecondaryClass}`}>
            Core Equation: (Source Amount * (Target Rate / Source Rate))
          </span>
          
          <div className="font-mono text-base sm:text-lg font-bold flex flex-wrap justify-center items-center gap-1.5 leading-relaxed">
            <span>{formatVal(amount, 2)}</span>
            <span className="opacity-75 text-xs font-sans px-1 text-current/75">{fromCode}</span>
            <span className="opacity-60 text-current/80">×</span>
            <div className="inline-flex flex-col items-center justify-center text-xs px-2 py-1 border-x border-current/15 rounded bg-black/5 leading-none">
              <span className="border-b border-current/30 pb-0.5">{formatVal(toRate, 4)} <span className="text-[10px] opacity-75">{toCode}</span></span>
              <span className="pt-0.5">{formatVal(fromRate, 4)} <span className="text-[10px] opacity-75">{fromCode}</span></span>
            </div>
            <span className="opacity-60 text-current/80">=</span>
            <span className={`px-2.5 py-0.5 rounded-lg text-lg sm:text-xl font-extrabold ${
              theme.id === 'dark-obsidian' ? 'bg-[#66FCF1]/10 text-[#66FCF1]' : 'bg-current/10'
            }`}>
              {formatVal(convertedAmount, decimalPlaces)}
            </span>
            <span className="text-xs font-semibold">{toCode}</span>
          </div>
        </div>

        {/* Footnote */}
        <div className="flex items-start gap-1.5 text-xs opacity-65 pt-1">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p>
            Rates are updated daily and stored securely in your browser's local cache. This ensures instant conversions and completely eliminates redundant network requests.
          </p>
        </div>
      </div>
    </div>
  );
}
