import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

const rateLimitHandler = (res, message = "Too many requests, please try again later.") => {
  return res.status(429).json({
    success: false,
    message,
  });
};


// General API limiter (100 req / 15 min)
const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "15 m"),
});

// Auth limiter (5 req / 15 min)
const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

// Transaction limiter (10 req / 1 min)
const transactionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});

// User-based limiter (50 req / 15 min)
const userLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, "15 m"),
});


// General limiter
const generalRateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip;

    const { success, limit, remaining } = await generalLimiter.limit(identifier);

    res.set({
      "X-RateLimit-Limit": limit,
      "X-RateLimit-Remaining": remaining,
    });

    if (!success) return rateLimitHandler(res);

    next();
  } catch (err) {
    console.error("General Rate Limiter Error:", err);
    next(); // need to know why this is here , added as AI suggested
  }
};

// Auth limiter
const authRateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip;

    const { success } = await authLimiter.limit(identifier);

    if (!success) {
      return rateLimitHandler(res, "Too many login attempts, try again later.");
    }

    next();
  } catch (err) {
    console.error("Auth Rate Limiter Error:", err);
    next();
  }
};

// Transaction limiter
const transactionRateLimiter = async (req, res, next) => {
  try {
    const identifier = req.user?.id || req.ip;

    const { success } = await transactionLimiter.limit(identifier);

    if (!success) {
      return rateLimitHandler(res, "Too many transaction requests, slow down.");
    }

    next();
  } catch (err) {
    console.error("Transaction Rate Limiter Error:", err);
    next();
  }
};

// User-based limiter
const userBasedLimiter = async (req, res, next) => {
  try {
    const identifier = req.user?.id || req.ip;

    const { success } = await userLimiter.limit(identifier);

    if (!success) return rateLimitHandler(res);

    next();
  } catch (err) {
    console.error("User Rate Limiter Error:", err);
    next();
  }
};

export {
  generalRateLimiter,
  authRateLimiter,
  transactionRateLimiter,
  userBasedLimiter,
};