import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});
pool.on('error', (err) => console.error('Unexpected PostgreSQL pool error:', err));
export const query = (text, params) => pool.query(text, params);
