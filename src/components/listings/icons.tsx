import React from "react";

const IconSVG = ({
  children,
  color = "#6c757d"
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const CalendarIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IconSVG>
);

export const RulerIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <rect x="3" y="11" width="18" height="4" rx="2" />
    <path d="M7 11V7M17 11V7" />
  </IconSVG>
);

export const LocationIcon = ({ color }: { color?: string }) => (
  <IconSVG color={color}>
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </IconSVG>
);

export const HeartIcon = ({
  isFilled,
  color = "#fff",
  size = 24
}: {
  isFilled?: boolean;
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={isFilled ? color : "none"}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
