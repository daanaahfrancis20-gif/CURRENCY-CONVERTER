export type ThemeId = 'dark-obsidian' | 'sunset-gold' | 'forest-moss' | 'glassmorphism';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  backgroundClass: string;
  cardClass: string;
  textPrimaryClass: string;
  textSecondaryClass: string;
  accentClass: string;
  accentHoverClass: string;
  inputClass: string;
  dividerClass: string;
}

export interface ExchangeRatesData {
  base: string;
  date: string;
  rates: Record<string, number>;
  timestamp: number; // For 24-hour cache comparison
}
