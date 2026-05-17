"use client";

import { useEffect, useState } from "react";

export type ResponsiveStyles = {
  imageHeight: number;
  isMobile: boolean;
  isTablet: boolean;
};

export const useResponsiveStyles = (): ResponsiveStyles => {
  const [styles, setStyles] = useState<ResponsiveStyles>({
    imageHeight: 240,
    isMobile: false,
    isTablet: false
  });

  useEffect(() => {
    const updateStyles = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      setStyles({
        imageHeight: isMobile ? 200 : isTablet ? 220 : 240,
        isMobile,
        isTablet
      });
    };

    updateStyles();
    window.addEventListener("resize", updateStyles);
    return () => window.removeEventListener("resize", updateStyles);
  }, []);

  return styles;
};
