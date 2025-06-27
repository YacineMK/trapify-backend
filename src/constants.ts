import * as dotenv from 'dotenv';
dotenv.config();

// Log the environment variables for debugging
console.log('Loading Guidini API config:', {
  url: process.env.guidini_api_url,
  key: process.env.guidini_api_key ? '[REDACTED]' : undefined,
  secret: process.env.guidini_api_secret ? '[REDACTED]' : undefined
});

export const APP_PORT = process.env.PORT || 3001;
export const MONGO_URI = process.env.MONGO_URI || 'tbd';
export const APP_HOST = process.env.APP_HOST || 'localhost';
export const guidiniApiUrl = process.env.guidini_api_url || 'tbd';
export const guidiniApiKey = process.env.guidini_api_key || 'tbd';
export const guidiniApiSecret = process.env.guidini_api_secret || 'tbd';