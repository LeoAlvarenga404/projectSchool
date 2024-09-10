import { config, ConnectionPool } from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConfig: config = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || '',
  database: process.env.DB_DATABASE || '',
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
};

let pool: ConnectionPool;

export const conexao = async () => {
  if (!pool) {
    pool = await new ConnectionPool(dbConfig).connect();
  }
  return pool;
};
