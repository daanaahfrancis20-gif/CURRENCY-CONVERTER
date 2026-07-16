import { Check, Moon, Sunset, Compass, Sparkles } from 'lucide-react';
import { themes } from '../data/themes';
import { ThemeId, ThemeConfig } from '../types';

interface ThemeSelectorProps {
  currentThemeId: ThemeId;
  onThemeChange: (id: ThemeId) => void;
  activeTheme: ThemeConfig;
}

export default function ThemeSelector({
  currentThemeId,
  onThemeChange,
  activeTheme,
}: ThemeSelectorProps) {
  const getIcon = (id: ThemeId, className: string) => {
    switch (id) {
      case 'dark-obsidian':
        return <Moon className={className} />;
      case 'sunset-gold':
        return <Sunset className={className} />;
      case 'forest-moss':
        return <Compass className={className} />;
      case 'glassmorphism':
        return <Sparkles className={className} />;
    }
  };

  const getThemePreviewStyles = (id: ThemeId) => {
    switch (id) {
      case 'dark-obsidian':
        return 'bg-[#0B0C10] border border-[#66FCF1]/20';
      case 'sunset-gold':
        return 'bg-gradient-to-tr from-amber-500 to-rose-500 border border-amber-200/30';
      case 'forest-moss':
        return 'bg-gradient-to-br from-emerald-800 to-green-600 border border-emerald-300/30';
      case 'glassmorphism':
        return 'bg-gradient-to-r from-violet-600 via-rose-500 to-indigo-600 border border-white/20';
    }
  };

  return (
    <div className="w-full" id="theme-selector-container">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${activeTheme.textSecondaryClass}`}>
        Select UI Theme
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {themes.map((theme) => {
          const isActive = theme.id === currentThemeId;
          const previewStyles = getThemePreviewStyles(theme.id);
          
          return (
            <button
              id={`theme-btn-${theme.id}`}
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 ${
                isActive 
                  ? 'ring-2 ring-offset-2 ring-offset-transparent shadow-lg scale-[1.01]' 
                  : 'opacity-85 hover:opacity-100'
              } ${
                currentThemeId === 'dark-obsidian' && isActive ? 'ring-[#66FCF1]' : ''
              } ${
                currentThemeId === 'sunset-gold' && isActive ? 'ring-amber-500' : ''
              } ${
                currentThemeId === 'forest-moss' && isActive ? 'ring-emerald-600' : ''
              } ${
                currentThemeId === 'glassmorphism' && isActive ? 'ring-white' : ''
              } ${activeTheme.cardClass}`}
            >
              {/* Theme Mini-Preview Bubble */}
              <div className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center ${previewStyles}`}>
                {getIcon(theme.id, 'w-3.5 h-3.5 text-white')}
              </div>

              <span className="text-xs font-semibold text-center truncate w-full">
                {theme.name}
              </span>

              {/* Active Indicator checkmark */}
              {isActive && (
                <div 
                  className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center ${
                    theme.id === 'dark-obsidian' ? 'bg-[#66FCF1] text-black' : 'bg-current text-white'
                  }`}
                  style={{ backgroundColor: theme.id !== 'dark-obsidian' ? undefined : '#66FCF1' }}
                >
                  <Check className={`w-2.5 h-2.5 ${theme.id === 'dark-obsidian' ? 'text-black font-bold' : 'text-inherit'}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
