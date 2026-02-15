import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { Pool } from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`;

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
