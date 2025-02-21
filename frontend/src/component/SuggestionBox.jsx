import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MapPin } from 'lucide-react';

const SuggestionBox = ({ activeField, value, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion?.place_name) return;
    onSelect(suggestion.place_name);
    setSuggestions([]); // Clear suggestions after selection
  }

  useEffect(() => {
    if (!value || value.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestion?address=${encodeURIComponent(value)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const places = response.data?.features || [];
        setSuggestions(places);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [value]);

  return (
    <div className="bg-white h-[90%] w-full flex justify-center items-center">
      {Array.isArray(suggestions) && suggestions.length > 0 ? (
        <div className='flex flex-col justify-start justify-items-start gap-2'>
          {suggestions?.map((suggestion, index) => (
            <div 
              className='flex items-center gap-1 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors' 
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className='w-9'/>
              <div className='text-black text-base font-medium'>
                {suggestion?.place_name}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No suggestions available</div>
      )}
    </div>
  );
};

export default SuggestionBox
