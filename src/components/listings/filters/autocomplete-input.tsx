"use client";

import React from "react";
import { FilterLabel } from "./filter-label";
import type { AutocompleteController } from "../hooks/use-autocomplete";

type AutocompleteInputProps = {
  label: string;
  placeholder: string;
  autocompleteHook: AutocompleteController;
  icon?: React.ReactNode;
};

export const AutocompleteInput = ({
  label,
  placeholder,
  autocompleteHook,
  icon
}: AutocompleteInputProps) => {
  const {
    value,
    showSuggestions,
    suggestions,
    handleChange,
    handleFocus,
    handleBlur,
    handleSuggestionClick
  } = autocompleteHook;

  return (
    <div style={{ position: "relative" }}>
      <FilterLabel icon={icon}>{label}</FilterLabel>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: "#ffffff",
            border: "1px solid #e1eef5",
            borderRadius: 14,
            boxShadow: "0 12px 28px rgba(10, 61, 98, 0.12)",
            zIndex: 10,
            maxHeight: label === "Engine" ? "250px" : "200px",
            overflowY: "auto",
            overflow: "hidden",
            padding: "0.25rem"
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "0.55rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#0a3d62",
                fontWeight: 500,
                borderRadius: 10,
                transition: "background 0.15s ease"
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#eaf3fb")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "transparent")
              }
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
