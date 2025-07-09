// src/lib/cookies.ts
import { cookies } from 'next/headers';

export function getCookies() {
  return cookies();
}