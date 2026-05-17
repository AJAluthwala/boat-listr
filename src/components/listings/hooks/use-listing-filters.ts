"use client";

import { useState } from "react";
import { FILTER_DATA } from "../constants";
import {
  useAutocomplete,
  type AutocompleteController
} from "./use-autocomplete";
import type { Listing } from "../types";

export type InitialListingFilters = Partial<{
  category: string;
  brand: string;
  year: string;
  minPrice: string;
  maxPrice: string;
  minPower: string;
  maxPower: string;
  minLength: string;
  maxLength: string;
  minCapacity: string;
  maxCapacity: string;
  location: string;
  engine: string;
}>;

export type ListingFilters = {
  category: string;
  brand: string;
  year: string;
  minPrice: string;
  maxPrice: string;
  minPower: string;
  maxPower: string;
  minLength: string;
  maxLength: string;
  minCapacity: string;
  maxCapacity: string;
  setCategory: (v: string) => void;
  setBrand: (v: string) => void;
  setYear: (v: string) => void;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  setMinPower: (v: string) => void;
  setMaxPower: (v: string) => void;
  setMinLength: (v: string) => void;
  setMaxLength: (v: string) => void;
  setMinCapacity: (v: string) => void;
  setMaxCapacity: (v: string) => void;
  locationAutocomplete: AutocompleteController;
  engineAutocomplete: AutocompleteController;
  apply: (allItems: Listing[]) => Listing[];
  reset: () => void;
};

export const useListingFilters = (
  initial: InitialListingFilters = {}
): ListingFilters => {
  const [category, setCategory] = useState(initial.category ?? "");
  const [brand, setBrand] = useState(initial.brand ?? "");
  const [year, setYear] = useState(initial.year ?? "");
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");
  const [minPower, setMinPower] = useState(initial.minPower ?? "");
  const [maxPower, setMaxPower] = useState(initial.maxPower ?? "");
  const [minLength, setMinLength] = useState(initial.minLength ?? "");
  const [maxLength, setMaxLength] = useState(initial.maxLength ?? "");
  const [minCapacity, setMinCapacity] = useState(initial.minCapacity ?? "");
  const [maxCapacity, setMaxCapacity] = useState(initial.maxCapacity ?? "");

  const locationAutocomplete = useAutocomplete(FILTER_DATA.usStates, 5, initial.location ?? "");
  const engineAutocomplete = useAutocomplete(FILTER_DATA.engineTypes, 8, initial.engine ?? "");

  const apply = (allItems: Listing[]): Listing[] => {
    const minPriceNum = minPrice ? Number(minPrice) : 0;
    const maxPriceNum = maxPrice ? Number(maxPrice) : Infinity;

    return allItems.filter((item) => {
      if (item.valueUSD < minPriceNum || item.valueUSD > maxPriceNum)
        return false;

      if (
        category &&
        !item.category.toLowerCase().includes(category.toLowerCase())
      )
        return false;

      if (year && item.manufacturedYear !== Number(year)) return false;

      if (
        locationAutocomplete.value &&
        !item.location
          .toLowerCase()
          .includes(locationAutocomplete.value.toLowerCase())
      )
        return false;

      return true;
    });
  };

  const reset = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setYear("");
    setBrand("");
    setMinPower("");
    setMaxPower("");
    setMinLength("");
    setMaxLength("");
    setMinCapacity("");
    setMaxCapacity("");
    locationAutocomplete.reset();
    engineAutocomplete.reset();
  };

  return {
    category,
    brand,
    year,
    minPrice,
    maxPrice,
    minPower,
    maxPower,
    minLength,
    maxLength,
    minCapacity,
    maxCapacity,
    setCategory,
    setBrand,
    setYear,
    setMinPrice,
    setMaxPrice,
    setMinPower,
    setMaxPower,
    setMinLength,
    setMaxLength,
    setMinCapacity,
    setMaxCapacity,
    locationAutocomplete,
    engineAutocomplete,
    apply,
    reset
  };
};
