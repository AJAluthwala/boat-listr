"use client";

import { useState } from "react";

export type AutocompleteController = {
  value: string;
  setValue: (value: string) => void;
  showSuggestions: boolean;
  suggestions: string[];
  handleChange: (inputValue: string) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleSuggestionClick: (selectedValue: string) => void;
  reset: () => void;
};

export const useAutocomplete = (
  dataSource: string[],
  maxSuggestions = 5,
  initialValue = ""
): AutocompleteController => {
  const [value, setValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const filterSuggestions = (input: string) =>
    dataSource
      .filter((item) => item.toLowerCase().includes(input.toLowerCase()))
      .slice(0, maxSuggestions);

  const handleChange = (inputValue: string) => {
    setValue(inputValue);

    if (inputValue.length > 0) {
      setSuggestions(filterSuggestions(inputValue));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleFocus = () => {
    if (value.length > 0) {
      setSuggestions(filterSuggestions(value));
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (selectedValue: string) => {
    setValue(selectedValue);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const reset = () => {
    setValue("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return {
    value,
    setValue,
    showSuggestions,
    suggestions,
    handleChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick,
    reset
  };
};
