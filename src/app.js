import express from 'express';
import cookieParser from 'cookie-parser';

// Routes import
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import { generalRateLimiter } from './middleware/rateLimiting.middleware.js';

const app = express();

app.use(express.json()); // middleware - express server cant read data from req.body, therefore a middleware does that for it

// Applying general rate limiter to all routes
app.use(generalRateLimiter);

app.use(cookieParser());

// test route 
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the banking system API, We are live and ready to serve you!"
    });
});

// use routes
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRoutes)

export default app;