import { Router } from 'express';
import { createTransaction, createInitialFundsTransaction } from '../controllers/transaction.controller.js';
import { authMiddleware, systemUserAuthMiddleware } from '../middleware/auth.middleware.js';
import { transactionRateLimiter, userBasedLimiter } from '../middleware/rateLimiting.middleware.js';

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Creates new transaction
 */

transactionRoutes.post("/", transactionRateLimiter, userBasedLimiter, authMiddleware, createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Creates initial funds for the system user
 */
transactionRoutes.post("/system/initial-funds", userBasedLimiter, systemUserAuthMiddleware, createInitialFundsTransaction);

export default transactionRoutes;