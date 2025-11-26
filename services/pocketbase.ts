import PocketBase from 'pocketbase';

// Determine the PocketBase URL
// 1. Check for Vite environment variable (if using Vite)
// 2. Check for global window variable (if injected)
// 3. Fallback to localhost for local development
const getPocketBaseUrl = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_POCKETBASE_URL) {
    // @ts-ignore
    return import.meta.env.VITE_POCKETBASE_URL;
  }
  // @ts-ignore
  if (typeof window !== 'undefined' && window.VITE_POCKETBASE_URL) {
      // @ts-ignore
      return window.VITE_POCKETBASE_URL;
  }
  return 'http://127.0.0.1:8090';
};

export const pb = new PocketBase(getPocketBaseUrl());

// Disable auto-cancellation for smoother UX in high-latency environments
pb.autoCancellation(false);

export const checkHealth = async () => {
    try {
        return await pb.health.check();
    } catch (e) {
        console.warn("PocketBase is unreachable:", e);
        return null;
    }
};
