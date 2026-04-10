import express from "express";
import { userRegisterControlller, userLoginController, userLogoutController } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middleware/rateLimiting.middleware.js';

const router = express.Router();

/* POST /api/auth/register */
router.post("/register", authRateLimiter, userRegisterControlller);

/* POST /api/auth/login */
router.post("/login", authRateLimiter, userLoginController);

/* POST /api/auth/logout */
router.post("/logout", authRateLimiter, userLogoutController);


export default router;