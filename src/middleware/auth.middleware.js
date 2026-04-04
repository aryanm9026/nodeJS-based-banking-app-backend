import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import tokenBlackListModel from '../models/blackList.model.js';


async function authMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    const isBlackListed = await tokenBlackListModel.findOne({ token });

    if (isBlackListed) {
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId);

        req.user = user;

        return next();
    } catch(err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

async function systemUserAuthMiddleware(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    const isBlackListed = await tokenBlackListModel.findOne({ token });

    if (isBlackListed) {
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");

        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, user is not a system user"
            });
        }

        req.user = user;

        return next();

    } catch(err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}

export { authMiddleware, systemUserAuthMiddleware };