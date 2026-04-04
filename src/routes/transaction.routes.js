import { Router } from 'express';
import { createTransaction, createInitialFundsTransaction } from '../controllers/transaction.controller.js';
import { authMiddleware, systemUserAuthMiddleware } from '../middleware/auth.middleware.js';

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Creates new transaction
 */

transactionRoutes.post("/", authMiddleware, createTransaction);

/**
 * - POST /api/transactions/system/initial-funds
 * - Creates initial funds for the system user
 */
transactionRoutes.post("/system/initial-funds", systemUserAuthMiddleware, createInitialFundsTransaction);

export default transactionRoutes;