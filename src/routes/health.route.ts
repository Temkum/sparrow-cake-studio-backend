import { Router } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  let dbStatus = { connected: false, error: null as string | null };

  try {
    await db.execute(sql`SELECT 1`);
    dbStatus.connected = true;
  } catch (err: any) {
    dbStatus.error = err.message || 'Database connection failed';
  }

  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    uptimeHuman: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: (memory.rss / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (memory.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
      heapUsed: (memory.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
    },
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid,
    database: dbStatus,
  });
});

export default router;
