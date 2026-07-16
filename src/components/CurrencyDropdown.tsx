import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { getCurrencyInfo, CurrencyInfo, countryToCurrencyMap } from '../data/currencies';
import { ThemeConfig } from '../types';

interface CurrencyDropdownProps {
  label: string;
  selectedCode: string;
  onChange: (code: string) => void;
  availableCodes: string[];
  theme: ThemeConfig;
  idPrefix: string;
}

export default function CurrencyDropdown({
  label,
  selectedCode,
  onChange,
  availableCodes,
  theme,
  idPrefix,
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const selectedInfo = useMemo(() => getCurrencyInfo(selectedCode), [selectedCode]);

  // Map and filter currencies list based on availableCodes from the API
  const filteredCurrencies = useMemo(() => {
    // Standardize searchable array
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) {
      return availableCodes.map(code => getCurrencyInfo(code));
    }

    // Find all currency codes that have country names/aliases matching searchLower
    const matchingCodesByCountry = new Set<string>();
    for (const [countryName, code] of Object.entries(countryToCurrencyMap)) {
      if (countryName.includes(searchLower)) {
        matchingCodesByCountry.add(code.toUpperCase());
      }
    }
    
    return availableCodes
      .map(code => getCurrencyInfo(code))
      .filter(curr => {
        return (
          curr.code.toLowerCase().includes(searchLower) ||
          curr.name.toLowerCase().includes(searchLower) ||
          matchingCodesByCountry.has(curr.code.toUpperCase())
        );
      });
  }, [availableCodes, searchQuery]);

  // Reset activeIndex when filtered list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredCurrencies]);

  // AUTO-RECOGNITION & AUTO-SELECTION when typing:
  useEffect(() => {
    const queryLower = searchQuery.trim().toLowerCase();
    if (!queryLower) return;

    // 1. Check for an exact country name/alias match in our countryToCurrencyMap (e.g. typing "germany" -> EUR)
    const exactCountryCode = countryToCurrencyMap[queryLower];
    if (exactCountryCode) {
      const matched = availableCodes.find(code => code.toUpperCase() === exactCountryCode.toUpperCase());
      if (matched) {
        onChange(matched);
        setIsOpen(false);
        setSearchQuery('');
        return;
      }
    }

    // 2. If it's an exact 3-letter currency code match (e.g. typing "USD")
    if (queryLower.length === 3) {
      const matched = availableCodes.find(code => code.toLowerCase() === queryLower);
      if (matched) {
        onChange(matched);
        setIsOpen(false);
        setSearchQuery('');
        return;
      }
    }

    // 3. If there's exactly one match in the filtered list and the user typed 3 or more characters (e.g. typing "Japan" -> JPY)
    if (queryLower.length >= 3 && filteredCurrencies.length === 1) {
      const matched = filteredCurrencies[0];
      onChange(matched.code);
      setIsOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, filteredCurrencies, availableCodes, onChange]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard Navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredCurrencies.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredCurrencies.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredCurrencies.length) % filteredCurrencies.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const currentSelection = filteredCurrencies[activeIndex];
      if (currentSelection) {
        onChange(currentSelection.code);
        setIsOpen(false);
        setSearchQuery('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Ensure active index option is visible in scroll container
  useEffect(() => {
    if (isOpen && listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      if (activeEl) {
        const container = listContainerRef.current;
        const activeTop = activeEl.offsetTop;
        const activeBottom = activeTop + activeEl.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (activeTop < containerTop) {
          container.scrollTop = activeTop;
        } else if (activeBottom > containerBottom) {
          container.scrollTop = activeBottom - container.clientHeight;
        }
      }
    }
  }, [activeIndex, isOpen]);

  // Determine dropdown styling based on theme
  const listBgClass = useMemo(() => {
    switch (theme.id) {
      case 'dark-obsidian':
        return 'bg-[#1F2833] border border-[#45A29E]/30 text-white';
      case 'sunset-gold':
        return 'bg-[#FFFDF9] border border-amber-200 text-[#4A2E1B]';
      case 'forest-moss':
        return 'bg-[#F4F6F0] border border-emerald-200 text-[#1B3B2B]';
      case 'glassmorphism':
        return 'backdrop-blur-xl bg-slate-900/85 border border-white/20 text-white';
      default:
        return 'bg-white border text-gray-900';
    }
  }, [theme.id]);

  const itemHoverClass = useMemo(() => {
    switch (theme.id) {
      case 'dark-obsidian':
        return 'hover:bg-[#66FCF1]/10 text-white';
      case 'sunset-gold':
        return 'hover:bg-amber-100 text-[#4A2E1B]';
      case 'forest-moss':
        return 'hover:bg-emerald-100 text-[#1B3B2B]';
      case 'glassmorphism':
        return 'hover:bg-white/20 text-white';
      default:
        return 'hover:bg-gray-100';
    }
  }, [theme.id]);

  const activeItemClass = useMemo(() => {
    switch (theme.id) {
      case 'dark-obsidian':
        return 'bg-[#66FCF1]/20 border-l-4 border-[#66FCF1]';
      case 'sunset-gold':
        return 'bg-amber-200/60 border-l-4 border-amber-500';
      case 'forest-moss':
        return 'bg-emerald-200/60 border-l-4 border-emerald-600';
      case 'glassmorphism':
        return 'bg-white/25 border-l-4 border-white';
      default:
        return 'bg-gray-200 border-l-4 border-blue-500';
    }
  }, [theme.id]);

  return (
    <div className="relative w-full" ref={dropdownRef} id={`${idPrefix}-dropdown-container`}>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme.textSecondaryClass}`}>
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        id={`${idPrefix}-trigger-btn`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 outline-none border ${theme.inputClass} cursor-pointer`}
      >
        <div className="flex items-center gap-3">
          <img
            src={`https://flagcdn.com/w40/${selectedInfo.country}.png`}
            onError={(e) => {
              // Fallback to generic flag or transparent placeholder if error
              (e.target as HTMLImageElement).src = 'https://flagcdn.com/w40/un.png';
            }}
            alt={`${selectedInfo.code} flag`}
            className="w-7 h-5 object-cover rounded shadow-sm border border-black/10"
          />
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg leading-none">{selectedInfo.code}</span>
            <span className="text-xs opacity-75 truncate max-w-[120px] sm:max-w-[180px] hidden md:inline">
              — {selectedInfo.name}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown List Container */}
      {isOpen && (
        <div
          id={`${idPrefix}-list-container`}
          className={`absolute z-50 left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden max-h-80 flex flex-col ${listBgClass}`}
        >
          {/* Search Box */}
          <div className="p-2 border-b border-inherit flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50 ml-2 shrink-0" />
            <input
              id={`${idPrefix}-search-input`}
              ref={searchInputRef}
              type="text"
              placeholder="Start typing currency or country name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-0 outline-none py-1.5 text-sm placeholder:opacity-50"
            />
          </div>

          {/* Currency Items */}
          <div 
            ref={listContainerRef}
            className="overflow-y-auto max-h-60 custom-scrollbar divide-y divide-inherit"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((curr, idx) => {
                const isSelected = curr.code === selectedCode;
                const isHighlighted = idx === activeIndex;
                
                return (
                  <button
                    data-index={idx}
                    id={`${idPrefix}-option-${curr.code.toLowerCase()}`}
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      onChange(curr.code);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 ${
                      isHighlighted || isSelected ? activeItemClass : itemHoverClass
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://flagcdn.com/w40/${curr.country}.png`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://flagcdn.com/w40/un.png';
                        }}
                        alt={`${curr.code} flag`}
                        className="w-7 h-5 object-cover rounded shadow-xs border border-black/5"
                      />
                      <div>
                        <span className="font-bold text-sm block">{curr.code}</span>
                        <span className="text-xs opacity-75">{curr.name}</span>
                      </div>
                    </div>
                    {(isSelected || isHighlighted) && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-current/10">
                        {isSelected ? 'Selected' : 'Press Enter'}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-xs opacity-60">
                No currencies found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
