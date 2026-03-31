import userModal from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import sendRegistrationEmail from '../services/email.service.js'

/**
 * - User Register Controller
 * - POST /api/auth/register
*/
async function userRegisterControlller(req, res) {
    const { email, password, name } = req.body;

    const isExist = await userModal.findOne({
        email: email
    });

    if (isExist) {
        return res.status(422).json({
            message:"User already exists.",
            status:"failed"
        });
    }

    const user = await userModal.create({
        email,
        password,
        name
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d"});

    res.cookie("token", token);

    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });

    await sendRegistrationEmail(user.email, user.name);

}


/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModal.findOne({ email }).select("password");

    if (!user) {
        return res.status(401).json({
            message:"Email is INVALID or the user may NOT EXIST"
        });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Invalid password"
        });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.cookie("token", token);

    res.status(200).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

export { userRegisterControlller, userLoginController };