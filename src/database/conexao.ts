import { config, ConnectionPool } from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConfig: config = {
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || '',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || '',
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
};

let pool: ConnectionPool;

export const conexao = async () => {
  if (!pool) {
    try {
      pool = await new ConnectionPool(dbConfig).connect();
      console.log("Conexão com o banco de dados estabelecida com sucesso");
    } catch (error) {
      console.error("Erro ao estabelecer a conexão com o banco de dados", error);
      throw error;
    }
  }
  return pool;
};