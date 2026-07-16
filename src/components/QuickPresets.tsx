import { ThemeConfig } from '../types';

interface QuickPresetsProps {
  currentAmount: number;
  onAmountChange: (amount: number) => void;
  theme: ThemeConfig;
}

export default function QuickPresets({ currentAmount, onAmountChange, theme }: QuickPresetsProps) {
  const presets = [
    { label: '+10', value: 10 },
    { label: '+100', value: 100 },
    { label: '+1,000', value: 1000 },
    { label: '+10,000', value: 10000 },
  ];

  const handleReset = () => {
    onAmountChange(1);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5" id="quick-presets-container">
      {presets.map((preset) => (
        <button
          id={`preset-btn-${preset.label.replace(/,/g, '')}`}
          key={preset.label}
          type="button"
          onClick={() => onAmountChange(Math.max(0, currentAmount + preset.value))}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            theme.id === 'dark-obsidian' 
              ? 'bg-[#1F2833] hover:bg-[#66FCF1]/20 text-[#66FCF1] border border-[#45A29E]/30' 
              : 'bg-current/5 hover:bg-current/15 text-current'
          }`}
        >
          {preset.label}
        </button>
      ))}
      <button
        id="preset-btn-reset"
        type="button"
        onClick={handleReset}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          theme.id === 'dark-obsidian'
            ? 'bg-rose-950/40 text-rose-400 hover:bg-rose-900/40 border border-rose-800/30'
            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600'
        }`}
      >
        Reset
      </button>
    </div>
  );
}
