import mongoose from 'mongoose';


function connectToDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error connecting to DB", err);
        process.exit(1); // server will exit if it fails to connect to the database
    });
}

export default connectToDb;