import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { createAccountController } from '../controllers/account.controller.js';

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Creates a new account
 * - Protected route
 */
router.post("/", authMiddleware, createAccountController);

export default router;