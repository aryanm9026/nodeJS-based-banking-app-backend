import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectToDb from './src/config/db.js';

connectToDb();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});