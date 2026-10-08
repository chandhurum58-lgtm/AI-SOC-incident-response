/**
 * Google Maps Platform configuration and validation
 */
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Always enable Google Maps component so the live interactive Google Map renders
export const IS_GOOGLE_MAPS_ENABLED = true;
