"use client";

import React from "react";
import { FilterLabel } from "./filter-label";

type RangeInputProps = {
  label: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  icon?: React.ReactNode;
};

export const RangeInput = ({
  label,
  minPlaceholder,
  maxPlaceholder,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  icon
}: RangeInputProps) => (
  <div>
    <FilterLabel icon={icon}>{label}</FilterLabel>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem"
      }}
    >
      <input
        type="number"
        placeholder={minPlaceholder}
        value={minValue}
        onChange={(e) => onMinChange(e.target.value)}
        style={{ flex: 1, minWidth: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          color: "#9aaabd",
          fontWeight: 600,
          fontSize: "0.85rem"
        }}
      >
        —
      </span>
      <input
        type="number"
        placeholder={maxPlaceholder}
        value={maxValue}
        onChange={(e) => onMaxChange(e.target.value)}
        style={{ flex: 1, minWidth: 0 }}
      />
    </div>
  </div>
);

export default RangeInput;
