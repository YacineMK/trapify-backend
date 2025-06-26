import * as dotenv from 'dotenv';
dotenv.config();

export const APP_PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || 'tbd';
export const APP_HOST = process.env.APP_HOST || 'localhost';