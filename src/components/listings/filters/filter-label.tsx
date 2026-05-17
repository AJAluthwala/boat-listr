"use client";

import React from "react";

type FilterLabelProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
};

export const FilterLabel = ({ children, icon }: FilterLabelProps) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: "0.5rem",
      fontSize: "0.72rem",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "#0a3d62"
    }}
  >
    {icon && (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1883ff"
        }}
      >
        {icon}
      </span>
    )}
    {children}
  </label>
);

export default FilterLabel;
