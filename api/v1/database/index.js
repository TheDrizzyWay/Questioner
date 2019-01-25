import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let connectionString;
/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DATABASE_URL_TEST;
} else {
  connectionString = process.env.DATABASE_URL;
}

const pool = new Pool({ connectionString });

export default pool;
