// src/hooks/useScreenSize.ts
'use client';
import { useState, useEffect } from 'react';

export default function useScreenSize(size: number) {
  const [isBelowSize, setIsBelowSize] = useState(false); // Default to false

  useEffect(() => {
    const handleResize = () => setIsBelowSize(window.innerWidth < size);
    setIsBelowSize(window.innerWidth < size); // Set initial value on client
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size]);

  return isBelowSize;
}