import mongoose from 'mongoose';

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting."],
        unique: [true, "Token is already blacklisted."],
        index: true
    },
    blacklistedAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
},
{
    timestamps: true
});

blackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 3 days = 60*60*24*3 = 259200 seconds


const tokenBlackListModel = mongoose.model("tokenBlackList", blackListSchema);

export default tokenBlackListModel;