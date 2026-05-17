"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useAuth } from "@/components/auth/auth-context";
import type { Listing } from "@/components/listings/types";

type FavoritesContextValue = {
  favorites: Listing[];
  loading: boolean;
  isFavorited: (id: number) => boolean;
  toggleFavorite: (listing: Listing) => Promise<void>;
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesApiResponse = {
  favorites?: Array<{ listing?: Listing | null }>;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch favorites");
      const data = (await response.json()) as FavoritesApiResponse;
      const listings = (data.favorites ?? [])
        .map((entry) => entry.listing)
        .filter((listing): listing is Listing => listing != null);
      setFavorites(listings);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      void fetchFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [isAuthenticated, token, fetchFavorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((f) => f.id)),
    [favorites]
  );

  const isFavorited = useCallback(
    (id: number) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (listing: Listing) => {
      if (!token) return;
      const wasFavorited = favoriteIds.has(listing.id);

      setFavorites((prev) =>
        wasFavorited
          ? prev.filter((f) => f.id !== listing.id)
          : [listing, ...prev]
      );

      try {
        const response = await fetch("/api/favorites", {
          method: wasFavorited ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ listingId: listing.id })
        });
        if (!response.ok) throw new Error("Toggle failed");
      } catch {
        void fetchFavorites();
      }
    },
    [token, favoriteIds, fetchFavorites]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      loading,
      isFavorited,
      toggleFavorite,
      refresh: fetchFavorites
    }),
    [favorites, loading, isFavorited, toggleFavorite, fetchFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
};
