"use client";

import { useEffect, useState } from "react";
import type { Listing } from "../types";

const PAGE_SIZE = 100;

async function fetchPage(page: number): Promise<{
  items: Listing[];
  total: number;
}> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE)
  });
  const response = await fetch(`/api/listings?${params.toString()}`);
  const payload = (await response.json()) as {
    items?: Listing[];
    total?: number;
  };
  return {
    items: payload.items ?? [],
    total: payload.total ?? 0
  };
}

export const useListings = () => {
  const [allItems, setAllItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      const first = await fetchPage(1);
      const total = first.total || first.items.length;
      const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

      const remainingPages: Promise<{ items: Listing[]; total: number }>[] = [];
      for (let page = 2; page <= pageCount; page += 1) {
        remainingPages.push(fetchPage(page));
      }

      const remaining = await Promise.all(remainingPages);
      const data = [...first.items, ...remaining.flatMap((p) => p.items)];

      if (active) {
        setAllItems(data);
        setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { allItems, loading };
};
