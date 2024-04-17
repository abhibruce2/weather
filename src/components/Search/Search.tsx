import React, { useEffect, useRef, useState } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { useDispatch } from 'react-redux';
import { fetchWeather } from '../../store/fetchWeather';
import { fetchCities } from './../../api/placeSuggestion';
import { useClickOutside } from './../../hooks/useClickOutside';
import { LocationButton, LocationIcon, SearchElement, SearchIcon, SearchInput, SearchResult } from './styled';
import Suggestion from './Suggestion';

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const suggestionRef = useRef(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  console.log("🚀 ~ suggestions:", suggestions)
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!searchTerm) {
      return;
    }
    setShowSuggestions(true);
    fetchCities(searchTerm).then((res) => {
      setSuggestions(res);
    });
  }, [searchTerm]);

  useClickOutside(suggestionRef, () => setShowSuggestions(false));

  const onSearchInputChanged = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const showPosition = (position: any) => {
    dispatch(
      fetchWeather({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  };
  return (
    <SearchElement>
      <SearchIcon />
      <DebounceInput element={SearchInput} debounceTimeout={300} onChange={onSearchInputChanged} placeholder="Search for location" />
      <LocationButton
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
          } else {
            alert('Geolocation is not supported by this browser.');
          }
        }}
      >
        <LocationIcon />
      </LocationButton>
      {showSuggestions && (
        <SearchResult ref={suggestionRef}>
          {/* { console.log("s-------",suggestions)} */}
          {suggestions?.slice(0, 6)?.map((s, i) => (
            // console.log(s.formatted)
            <Suggestion
              key={i}
              label={s.formatted}
              hideSuggestionFn={() => {
                setShowSuggestions(false);
              }}
            />
          ))}
        </SearchResult>
      )}
    </SearchElement>
  );
};

export default Search;
