import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'kdslkqedA3984720',
  jwtSecret: process.env.JWT_SECRET || 'AKJHGSDHJKSA_KS',
  databaseFetchUrl: process.env.DATABASE_FETCH_URL || 'https://api.sportradar.com/nba/trial/v8/en/games/2024/REG/schedule.json?api_key=MDk8oJ4rnUlASMnNBGYHkPItlF6CfGXzPVMbxffy',
  nodeEnv: process.env.NODE_ENV || 'prod',
  DB_PROD_URI_FINAL: process.env.DB_PROD_URI_FINAL || "mongodb+srv://poirieroli:abc-123@dunktheodds.qfl1o.mongodb.net/TpFinal_Prod",
  DB_TEST_URI_FINAL: process.env.DB_TEST_URI_FINAL || "mongodb+srv://poirieroli:abc-123@dunktheodds.qfl1o.mongodb.net/TpFinal_Test"
};
