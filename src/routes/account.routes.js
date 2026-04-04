import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccountController, getAccountBalanceController, getUserAccountsController } from '../controllers/account.controller.js';

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Creates a new account
 * - Protected route
 */
router.post("/", authMiddleware, createAccountController);

/**
 * - GET /api/accounts/
 * - Retrieves a list of accounts
 * - Protected route
 */
router.get("/", authMiddleware, getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 * - Retrieves the balance of a specific account
 * - Protected route
 */
router.get("/balance/:accountId", authMiddleware, getAccountBalanceController);

export default router;