import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Please enter sender's account."],
        index: true
    },
    toAccount : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Please enter reciver's account."],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED.",
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction."],
        min: [0, "Invalid transaction amount."]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for creating a transaction."],
        index: true,
        unique: true
    }
}, {
    timestamps: true
});

export const transactionModel = mongoose.model("transaction", transactionSchema);