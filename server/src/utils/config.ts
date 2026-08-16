import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

let jwtSecret = process.env.SESSION_SECRET;

if (!jwtSecret) {
  if (isProduction) {
    throw new Error('CRITICAL SECURITY ERROR: SESSION_SECRET environment variable must be set in production!');
  } else {
    console.warn(
      '⚠️  [SECURITY WARNING] SESSION_SECRET is not set in environment. Using development secret. Set SESSION_SECRET in production.'
    );
    jwtSecret = 'sentinel_dev_secret_jwt_key_2026_behavioral_fraud_intel';
  }
}

export const JWT_SECRET = jwtSecret;
export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
export const IS_PRODUCTION = isProduction;
