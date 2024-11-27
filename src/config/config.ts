// src/config/config.ts
import dotenv from 'dotenv';

// Charger les variables d'environnement à partir du fichier .env
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'kdslkqedA3984720',
  jwtSecret: process.env.JWT_SECRET || 'AKJHGSDHJKSA_KS',
  databaseFetchUrl: process.env.DATABASE_FETCH_URL || 'https://api.sportradar.com/nba/trial/v8/en/games/2024/REG/schedule.json?api_key=P2IWsEF0Qk70Io2LKTMd5yhrGSzoWWKYK2esg3Vh',
  nodeEnv: process.env.NODE_ENV || 'prod',
  DB_PROD_URI: process.env.DB_PROD_URI || "mongodb+srv://poirieroli:abc-123@clustertp2.abh3l.mongodb.net/TpFinal_Prod",
  DB_TEST_URI: process.env.DB_TEST_URI || "mongodb+srv://poirieroli:abc-123@clustertp2.abh3l.mongodb.net/TpFinal_Test"

};