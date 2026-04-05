import express from "express";
import { userRegisterControlller, userLoginController, userLogoutController } from '../controllers/auth.controller.js';

const router = express.Router();

/* POST /api/auth/register */
router.post("/register", userRegisterControlller);

/* POST /api/auth/login */
router.post("/login", userLoginController);

/* POST /api/auth/logout */
router.post("/logout", userLogoutController);


export default router;