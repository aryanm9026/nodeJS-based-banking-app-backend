import express from 'express';
import cookieParser from 'cookie-parser';

// Routes import
import authRouter from './routes/auth.routes.js';
import accountRouter from './routes/account.routes.js';

const app = express();

app.use(express.json()); // middleware - express server cant read data from req.body, therefore a middleware does that for it

app.use(cookieParser());


// use routes
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

export default app;