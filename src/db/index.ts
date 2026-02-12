import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
