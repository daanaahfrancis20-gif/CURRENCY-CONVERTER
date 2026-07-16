import { ThemeConfig } from '../types';

export const themes: ThemeConfig[] = [
  {
    id: 'dark-obsidian',
    name: 'Dark Obsidian',
    backgroundClass: 'bg-[#0B0C10]',
    cardClass: 'bg-[#1F2833]/90 border border-[#45A29E]/30 shadow-2xl shadow-[#66FCF1]/5',
    textPrimaryClass: 'text-white',
    textSecondaryClass: 'text-[#C5C6C7]',
    accentClass: 'bg-[#66FCF1] text-[#0B0C10] font-semibold focus:ring-[#66FCF1]',
    accentHoverClass: 'hover:bg-[#45A29E] hover:text-white',
    inputClass: 'bg-[#0B0C10] text-white border-[#45A29E]/40 focus:border-[#66FCF1] focus:ring-[#66FCF1]/50',
    dividerClass: 'border-[#45A29E]/20'
  },
  {
    id: 'sunset-gold',
    name: 'Sunset Gold',
    backgroundClass: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500',
    cardClass: 'bg-[#FFFDF9]/95 border border-amber-200/50 shadow-2xl shadow-orange-950/20',
    textPrimaryClass: 'text-[#4A2E1B]',
    textSecondaryClass: 'text-[#7A6150]',
    accentClass: 'bg-amber-500 text-white font-semibold focus:ring-amber-500 shadow-md shadow-amber-500/20',
    accentHoverClass: 'hover:bg-amber-600',
    inputClass: 'bg-[#FFFDF9] text-[#4A2E1B] border-amber-200 focus:border-amber-500 focus:ring-amber-500/50',
    dividerClass: 'border-amber-100'
  },
  {
    id: 'forest-moss',
    name: 'Forest Moss',
    backgroundClass: 'bg-gradient-to-br from-emerald-800 via-teal-700 to-green-600',
    cardClass: 'bg-[#F4F6F0]/95 border border-emerald-200/50 shadow-2xl shadow-emerald-950/20',
    textPrimaryClass: 'text-[#1B3B2B]',
    textSecondaryClass: 'text-[#4A6B5D]',
    accentClass: 'bg-emerald-600 text-white font-semibold focus:ring-emerald-600 shadow-md shadow-emerald-600/20',
    accentHoverClass: 'hover:bg-emerald-700',
    inputClass: 'bg-white text-[#1B3B2B] border-emerald-200 focus:border-emerald-600 focus:ring-emerald-600/50',
    dividerClass: 'border-emerald-100'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    backgroundClass: 'bg-gradient-to-r from-violet-600 via-rose-500 to-indigo-600 animate-moving-gradient',
    cardClass: 'backdrop-blur-md bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
    textPrimaryClass: 'text-white',
    textSecondaryClass: 'text-white/70',
    accentClass: 'bg-white text-violet-950 font-semibold focus:ring-white shadow-lg shadow-black/10',
    accentHoverClass: 'hover:bg-white/90',
    inputClass: 'bg-white/10 text-white placeholder-white/40 border-white/20 focus:border-white/50 focus:ring-white/30',
    dividerClass: 'border-white/10'
  }
];
