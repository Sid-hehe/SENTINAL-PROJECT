import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/index.js';

dotenv.config();

import { PORT, CLIENT_URL, IS_PRODUCTION } from './utils/config.js';

const app = express();

// Security & Parsing Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  return res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal error occurred.',
    },
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  SENTINEL API Server running on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
