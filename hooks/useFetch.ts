'use client';

import { NextResponse } from 'next/server';
import { useState, useEffect } from 'react';

export function useFetch<T>(
  url: string
): [T | null, boolean, string | null] {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(url);
        const { data } = await response.json();
        setData(data);
        setIsPending(false);
      } catch (error) {
        setError(`[${error}]: could not fetch data`);
        setIsPending(false);
        return new NextResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      }
    };

    fetchData();
  }, [url]);
  return [data, isPending, error];
}
