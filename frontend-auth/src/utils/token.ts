import Cookies from 'js-cookie';
import type { CookieAttributes } from '@/types/auth.interface';
import { logger } from './logger';

// Environment variables for cookie keys and TTL with proper error handling
const ACCESS_TTL_DAYS = (() => {
  const ttl = parseInt(import.meta.env.VITE_ACCESS_COOKIE_TTL_DAYS, 10);
  if (isNaN(ttl) || ttl <= 0) {
    logger.warn('Invalid ACCESS_TTL_DAYS, defaulting to 1 day');
    return 1;
  }
  return ttl;
})();

const REFRESH_TTL_DAYS = (() => {
  const ttl = parseInt(import.meta.env.VITE_REFRESH_COOKIE_TTL_DAYS, 10);
  if (isNaN(ttl) || ttl <= 0) {
    logger.warn('Invalid REFRESH_TTL_DAYS, defaulting to 7 days');
    return 7;
  }
  return ttl;
})();



// Cookie options with security settings
const baseCookieOptions: CookieAttributes = {
  secure: import.meta.env.PROD || import.meta.env.VITE_SECURE_COOKIES === 'true', // HTTPS only in production
  sameSite: 'strict', // Prevent CSRF
  path: '/', // Available across the site
  expires: 0, // Default expiry, will be set later
};

const accessCookieOptions: CookieAttributes = {
  ...baseCookieOptions,
  expires: ACCESS_TTL_DAYS
};

const refreshCookieOptions: CookieAttributes = {
  ...baseCookieOptions,
  expires: REFRESH_TTL_DAYS
};

// Get Access Token Cookies
export const getToken = (): string | null => {
  try {
    return Cookies.get(import.meta.env.VITE_TOKEN_KEY) || null;
  } catch (error) {
    logger.error('Error retrieving token:', error);
    return null;
  }
};


// Get Refresh Token Cookies
export const getRefreshToken = (): string | null => {
  try {
    return Cookies.get(import.meta.env.VITE_REFRESH_TOKEN_KEY) || null;
  } catch (error) {
    logger.error('Error retrieving refresh token:', error);
    return null;
  }
};

// Get Token Expiry Cookies (Fixed Saved when creating the accessToken)
export const getTokenExpiry = (): number => {
  try {
    const expiry = Cookies.get(import.meta.env.VITE_TOKEN_EXPIRY_KEY);
    const parsedExpiry = expiry ? parseInt(expiry, 10) : 0;

    // Validate the parsed value
    if (isNaN(parsedExpiry)) {
      logger.warn('Invalid token expiry value');
      return 0;
    }

    return parsedExpiry;
  } catch (error) {
    logger.error('Error retrieving token expiry:', error);
    return 0;
  }
}

// Save Access, Refresh Tokens and Expiry to Cookies
export const saveToken = (token: string, refreshToken?: string, expiresAt?: number): void => {
  // Cookies.set(import.meta.env.VITE_TOKEN_KEY, token, cookieOptions);

  if (!token) {
    logger.error('Cannot save empty token');
    return;
  }

  try {
    // Set the access token
    Cookies.set(import.meta.env.VITE_TOKEN_KEY, token, accessCookieOptions);

    // Set refresh token if provided
    if (refreshToken) {
      Cookies.set(import.meta.env.VITE_REFRESH_TOKEN_KEY, refreshToken, refreshCookieOptions);
    }

    // Compute default expiry timestamp = now + TTL_DAYS
    const now = Date.now();
    const defaultExpiry = now + (ACCESS_TTL_DAYS * 24 * 60 * 60 * 1000);

    // Use provided expiresAt if valid, else use default
    const expiryValue = expiresAt && expiresAt > now 
      ? expiresAt 
      : defaultExpiry;
    Cookies.set(
      import.meta.env.VITE_TOKEN_EXPIRY_KEY, 
      expiryValue.toString(), 
      {
        ...baseCookieOptions,
        expires: expiryValue, // Set expiry to the calculated value
      }
    );
  } catch (error) {
    logger.error('Error saving tokens:', error);
  }
};

// Remove all authentication cookies
export const removeToken = (): void => {
  try {
    // Use same options except expiry for removal
    const removalOptions = {
      secure: baseCookieOptions.secure,
      sameSite: baseCookieOptions.sameSite,
      path: baseCookieOptions.path
    };

    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, removalOptions);
    Cookies.remove(import.meta.env.VITE_REFRESH_TOKEN_KEY, removalOptions);
    Cookies.remove(import.meta.env.VITE_TOKEN_EXPIRY_KEY, removalOptions);
  } catch (error) {
    logger.error('Error removing tokens:', error);
  }
};

// Check if the token is valid based on its existence and expiry
export const isTokenValid = (): boolean => {
  const token = getToken();
  const expiry = getTokenExpiry();

  if (!token) return false;

  // If we have an expiry time, check if token is expired
  if (expiry) {
    return Date.now() < expiry;
  }
  // If no expiry time set, assume token is valid if it exists 
  // TODO: Apply a feature that will check on the validaty of the token and not just the existence of it for security
  return !!token;
};