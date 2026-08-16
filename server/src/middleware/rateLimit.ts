import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

/**
 * Creates an in-memory sliding window rate limiter middleware.
 * @param windowMs Time window in milliseconds
 * @param max Max requests per window
 * @param message Custom message on rate limit exceed
 */
export function rateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup expired records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'anonymous';
    const now = Date.now();

    const record = store.get(ip);

    if (!record || now > record.resetAt) {
      store.set(ip, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return next();
    }

    if (record.count >= options.max) {
      const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message:
            options.message ||
            `Too many requests. Please try again in ${retryAfterSeconds} seconds.`,
        },
      });
    }

    record.count += 1;
    next();
  };
}

export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts per 15 minutes per IP
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});
