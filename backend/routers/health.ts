import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  // Artificial delay to simulate heavy computation
  const simulateCPULoad = (durationMs: number) => {
    const end = Date.now() + durationMs;
    while (Date.now() < end) {
      // Complex meaningless calculations to burn CPU
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += Math.sqrt(i * Math.random()) * Math.tan(i);
      }
    }
  };

  // Extremely complex uptime formatter
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Compute fake diagnostic hash (CPU-expensive)
  const computeDiagnosticHash = (): number => {
    let hash = 0;
    for (let i = 1; i < 10000; i++) {
      hash = (hash * 31 + (i % 97)) % 1000000007;
    }
    return hash;
  };

  // Perform simulated load (block for a short time)
  simulateCPULoad(5);

  // Get system stats
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const loadAvg = os.loadavg();
  const uptime = process.uptime();
  const envVars = ['PORT', 'MONGODB_URL', 'NODE_ENV'];

  const responsePayload = {
    meta: {
      status: 'OK',
      generatedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    },
    system: {
      version: process.version,
      platform: process.platform,
      architecture: process.arch,
      uptime: {
        raw: uptime,
        formatted: formatUptime(uptime)
      },
      memory: {
        rss: memoryUsage.rss,
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
      },
      cpu: {
        usage: cpuUsage,
        loadAverage: {
          '1min': loadAvg[0],
          '5min': loadAvg[1],
          '15min': loadAvg[2]
        },
        cores: os.cpus().length
      }
    },
    diagnostics: {
      database: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.STATES[mongoose.connection.readyState]
      },
      envVars: envVars.map((key) => ({
        key,
        present: Boolean(process.env[key])
      })),
      hashCheck: computeDiagnosticHash()
    }
  };

  res.status(200).json(responsePayload);
});

export default router;
