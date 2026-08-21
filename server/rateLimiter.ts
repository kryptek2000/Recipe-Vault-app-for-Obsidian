import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const clientIpStore = new Map<string, RateLimitEntry>();

// Periodic cleanup every 5 minutes to prevent memory accumulation
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of clientIpStore.entries()) {
    if (entry.resetTime <= now) {
      clientIpStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Extracts a normalized client IP address from request headers or socket.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    if (ips) return ips.trim();
  }
  return req.ip || req.socket.remoteAddress || "127.0.0.1";
}

/**
 * Express middleware for in-memory rate limiting on recipe import endpoints.
 * Configurable via `RECIPE_IMPORT_RATE_LIMIT` (default 15 requests per minute).
 */
export function recipeImportRateLimiter(req: Request, res: Response, next: NextFunction) {
  const parsedLimit = parseInt(process.env.RECIPE_IMPORT_RATE_LIMIT || "15", 10);
  const maxRequestsPerWindow = isNaN(parsedLimit) || parsedLimit <= 0 ? 15 : parsedLimit;
  const windowMs = 60 * 1000; // 1 minute window

  const clientIp = getClientIp(req);
  const now = Date.now();

  let entry = clientIpStore.get(clientIp);

  if (!entry || entry.resetTime <= now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    clientIpStore.set(clientIp, entry);
  } else {
    entry.count += 1;
  }

  const remaining = Math.max(0, maxRequestsPerWindow - entry.count);
  const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

  res.setHeader("RateLimit-Limit", maxRequestsPerWindow);
  res.setHeader("RateLimit-Remaining", remaining);
  res.setHeader("RateLimit-Reset", resetSeconds);

  if (entry.count > maxRequestsPerWindow) {
    res.setHeader("Retry-After", resetSeconds);
    return res.status(429).json({
      error: "Too many recipe import requests from your IP. Please try again in a minute.",
      retryAfterSeconds: resetSeconds,
    });
  }

  next();
}

/**
 * Express middleware for rate limiting on AI nutrition estimation endpoints.
 * Configurable via `NUTRITION_RATE_LIMIT` (default 20 requests per minute).
 */
export function nutritionEstimateRateLimiter(req: Request, res: Response, next: NextFunction) {
  const parsedLimit = parseInt(process.env.NUTRITION_RATE_LIMIT || "20", 10);
  const maxRequestsPerWindow = isNaN(parsedLimit) || parsedLimit <= 0 ? 20 : parsedLimit;
  const windowMs = 60 * 1000; // 1 minute window

  const clientIp = getClientIp(req);
  const now = Date.now();

  let entry = clientIpStore.get(`nutr_${clientIp}`);

  if (!entry || entry.resetTime <= now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    clientIpStore.set(`nutr_${clientIp}`, entry);
  } else {
    entry.count += 1;
  }

  const remaining = Math.max(0, maxRequestsPerWindow - entry.count);
  const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

  res.setHeader("RateLimit-Limit", maxRequestsPerWindow);
  res.setHeader("RateLimit-Remaining", remaining);
  res.setHeader("RateLimit-Reset", resetSeconds);

  if (entry.count > maxRequestsPerWindow) {
    res.setHeader("Retry-After", resetSeconds);
    return res.status(429).json({
      error: "Too many nutrition estimation requests. Please wait a moment before trying again.",
      retryAfterSeconds: resetSeconds,
    });
  }

  next();
}
