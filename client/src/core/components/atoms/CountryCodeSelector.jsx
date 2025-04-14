import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import countries from 'i18n-iso-countries';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'i18n-iso-countries/langs/en.json';

// Initialize the countries library
countries.registerLocale(en);

// Default fallback country to use before data loads
const DEFAULT_COUNTRY = { code: '+94', flag: '🇱🇰', name: 'Sri Lanka', iso: 'LK' };

const CountryCodeSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allCountryCodes, setAllCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const dropdownRef = useRef(null);
  
  // Initialize country codes on component mount
  useEffect(() => {
    try {
      const countriesData = getCountries().map(country => {
        try {
          const name = countries.getName(country, 'en') || country;
          let code = '';
          try {
            code = `+${getCountryCallingCode(country)}`;
          } catch (e) {
            // If can't get calling code, use empty string
            code = '';
          }
          
          // Get flag emoji by converting ISO country code to regional indicator symbols
          const flag = country
            .toUpperCase()
            .replace(/./g, char => 
              String.fromCodePoint(char.charCodeAt(0) + 127397)
            );
          
          return { code, flag, name, iso: country };
        } catch (e) {
          // Skip this country if there's an error
          return null;
        }
      }).filter(Boolean); // Remove any null entries
      
      // Sort by country name
      countriesData.sort((a, b) => a.name.localeCompare(b.name));
      setAllCountryCodes(countriesData);
      
      // Set selected country after data is loaded
      if (countriesData.length > 0) {
        // Try to find the country by value if provided
        if (value) {
          const found = countriesData.find(country => country.code === value);
          if (found) {
            setSelectedCountry(found);
          }
        } else {
          // Try to find Sri Lanka, or use the first country
          const sriLanka = countriesData.find(country => country.iso === 'LK');
          setSelectedCountry(sriLanka || countriesData[0] || DEFAULT_COUNTRY);
        }
      }
    } catch (error) {
      console.error("Error loading country data:", error);
    }
  }, [value]);
  
  // Update selected country when value changes
  useEffect(() => {
    if (value && allCountryCodes.length > 0) {
      const country = allCountryCodes.find(country => country.code === value);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [value, allCountryCodes]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Find filtered countries based on search
  const filteredCountries = allCountryCodes.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    country.code.includes(searchQuery)
  );
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-textColor hover:bg-gray-50"
      >
        <div className="flex items-center">
          <span className="mr-2">{selectedCountry?.flag || '🏳️'}</span>
          <span>{selectedCountry?.code || ''}</span>
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <div
                key={country.iso}
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <span className="mr-2">{country.flag}</span>
                <span className="text-sm">{country.code}</span>
                <span className="text-xs text-gray-500 ml-2">{country.name}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">No countries found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;
