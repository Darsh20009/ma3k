import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database connection with fallback support
let db: any = null;
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.warn('Failed to connect to database, will use in-memory storage:', error);
    db = null;
    pool = null;
  }
} else {
  console.log('No DATABASE_URL provided, using in-memory storage');
}

export { pool, db };
