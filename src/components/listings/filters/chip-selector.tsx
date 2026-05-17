"use client";

import React from "react";
import { FilterLabel } from "./filter-label";

type ChipSelectorProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  scrollable?: boolean;
  icon?: React.ReactNode;
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  border: active ? "1px solid #1883ff" : "1px solid #e1eef5",
  borderRadius: 999,
  padding: "0.42rem 0.85rem",
  fontWeight: active ? 600 : 500,
  fontSize: "0.78rem",
  cursor: "pointer",
  background: active ? "#1883ff" : "#f6fafd",
  color: active ? "#ffffff" : "#0a3d62",
  boxShadow: active ? "0 4px 10px rgba(24,131,255,0.25)" : "none",
  transition: "all 0.18s ease",
  whiteSpace: "nowrap"
});

export const ChipSelector = ({
  label,
  options,
  selected,
  onSelect,
  scrollable = false,
  icon
}: ChipSelectorProps) => (
  <div>
    <FilterLabel icon={icon}>{label}</FilterLabel>
    <div
      className="bl-chip-row"
      style={
        scrollable
          ? {
              maxHeight: "96px",
              overflowY: "auto",
              paddingRight: "4px",
              gap: "0.45rem"
            }
          : { gap: "0.45rem" }
      }
    >
      <button
        type="button"
        onClick={() => onSelect("")}
        style={chipStyle(selected === "")}
      >
        {label === "Year" ? "Any" : "All"}
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          style={chipStyle(selected === option)}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

export default ChipSelector;
