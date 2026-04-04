import { transactionModel } from "../models/transaction.model.js";
import ledgerModel from "../models/ledger.model.js";
import { sendTransactionEmail, sendTransactionFailedEmail } from '../services/email.service.js'
import accountModal from "../models/account.model.js";
import mongoose from "mongoose";


/**
 * - Creates new transaction
 * - Flow:
    * 1. Validate request
    * 2. Validate idempotency
    * 3. Check account status
    * 4. Derive sender balance from ledger
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ledger entry
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction as COMPLETED
    * 9. Commit mongoDB session
    * 10. Send email notification
 */

async function createTransaction(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Bad request, missing required fields",
        });
    }

    try {
        const fromUserAccount = await accountModal.findOne({ _id: fromAccount });

        if (!fromUserAccount) {
            return res.status(404).json({
                message: "Sender user account not found"
            });
        }

        const toUserAccount = await accountModal.findOne({ _id: toAccount });

        if (!toUserAccount) {
            return res.status(404).json({
                message: "Recipient user account not found"
            });
        }

        const transactionAlreadyExists = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        });

        if (transactionAlreadyExists) {
            if (transactionAlreadyExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed",
                    transaction: transactionAlreadyExists
                });
            }
            
            if (transactionAlreadyExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction already in progress",
l                });
            }

            if (transactionAlreadyExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction is failed, please retry",
                    transaction: transactionAlreadyExists
                });
            }

            if (transactionAlreadyExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction is reversed, please retry",
                });
            }
        }

        const toUserStatus = toUserAccount.status

        if (toUserStatus !== "ACTIVE") {
            return res.status(400).json({
                message: "Recipient account is not active"
            });
        }

        const fromUserStatus = fromUserAccount.status

        if (fromUserStatus !== "ACTIVE") {
            return res.status(400).json({
                message: "Sender account is not active"
            });
        }

        const balance = await fromUserAccount.getBalance();

        if (amount>balance) {
            return res.status(400).json({
                message: `Insufficient balance in sender account. Current balance is ${balance} , but required amount is ${amount}`
            });
        }

        let transaction;

        try {
        const session = await mongoose.startSession();
        session.startTransaction();

        transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }, { session });

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            transaction: transaction._id,
            type: "DEBIT",
            amount: amount
        }], { session });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            transaction: transaction._id,
            type: "CREDIT",
            amount: amount
        }], { session });

        // transaction.status = "COMPLETED";
        // await transaction.save({ session });

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { $set: { status: "COMPLETED" } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

    } catch (error) {
        return res.status(400).json({
            message: "Transaction is pending, please retry again after some time"
        });
    }

        await sendTransactionEmail(toUserAccount.user, amount, fromUserAccount._id);

        return res.status(201).json({
            message: "Transaction completed.",
            transaction: transaction
        });

    } catch (error) {
        await transactionModel.findOneAndUpdate(
            { idempotencyKey: idempotencyKey },
            { $set: { status: "FAILED" } },
            { new: true }
        );
        await sendTransactionFailedEmail(fromUserAccount.user, amount, toUserAccount._id);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
    
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "Bad request, missing required fields"
        });
    }

    try {
        const toUserAccount = await accountModal.findOne({ _id: toAccount });

        if (!toUserAccount) {
            return res.status(404).json({
                message: "Recipient user account not found"
            });
        }

        console.log(req.params);

        const fromUserAccount = await accountModal.findOne({ user: req.user._id });

        if (!fromUserAccount) {
            return res.status(404).json({
                message: "System user account not found"
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromUserAccount._id,
            transaction: transaction._id,
            type: "DEBIT",
            amount: amount
        }], { session });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toUserAccount._id,
            transaction: transaction._id,
            type: "CREDIT",
            amount: amount
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        await sendTransactionEmail(toUserAccount.user, amount, fromUserAccount._id);

        return res.status(201).json({
            message: "Initial funds transaction completed.",
            transaction: transaction
        });

    } catch (error) {
        console.error("Error creating initial funds transaction:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export { createTransaction, createInitialFundsTransaction };